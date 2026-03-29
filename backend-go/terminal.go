package main

import (
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"sync"

	"github.com/creack/pty"
	"github.com/gorilla/websocket"
)

var terminalUpgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type TerminalClient struct {
	conn *websocket.Conn
	room *TerminalRoom
}

type TerminalRoom struct {
	projectId string
	clients   map[*TerminalClient]bool
	pty       *os.File
	mutex     sync.Mutex
}

var (
	terminalRooms   = make(map[string]*TerminalRoom)
	terminalRoomsMu sync.Mutex
)

// getTerminalRoom returns an existing pure Go PTY terminal session, or spawns a new one strictly isolated to this project
func getTerminalRoom(userId, projectId string) (*TerminalRoom, error) {
	terminalRoomsMu.Lock()
	defer terminalRoomsMu.Unlock()

	if room, exists := terminalRooms[projectId]; exists {
		return room, nil
	}

	// Restrict executing space to the local projects directory
	// Verify directory exists
	cwd := filepath.Join("/app/skycompiler_projects", projectId)
	if err := os.MkdirAll(cwd, 0755); err != nil {
		return nil, err
	}

	// Create a .bashrc to define the custom terminal prompt
	bashrcPath := filepath.Join(cwd, ".bashrc")
	if _, err := os.Stat(bashrcPath); os.IsNotExist(err) {
		os.WriteFile(bashrcPath, []byte(`export PS1="\[\e[32m\]skycompile\[\e[m\]:\[\e[34m\]\w\[\e[m\]\$ "`+"\n"), 0644)
	}

	cmd := exec.Command("bash")
	cmd.Dir = cwd
	cmd.Env = append(os.Environ(), "HOME="+cwd, "TERM=xterm-256color")

	ptmx, err := pty.Start(cmd)
	if err != nil {
		return nil, err
	}

	room := &TerminalRoom{
		projectId: projectId,
		clients:   make(map[*TerminalClient]bool),
		pty:       ptmx,
	}
	terminalRooms[projectId] = room

	// Spawn a single background goroutine per project to read from the PTY and broadcast to ALL connected clients
	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := ptmx.Read(buf)
			if err != nil {
				log.Printf("PTY session %s closed: %v", projectId, err)
				break
			}
			data := buf[:n]

			room.mutex.Lock()
			for client := range room.clients {
				client.conn.WriteMessage(websocket.TextMessage, data)
			}
			room.mutex.Unlock()
		}

		// Cleanup when the bash session closes (e.g., user types 'exit')
		terminalRoomsMu.Lock()
		delete(terminalRooms, projectId)
		terminalRoomsMu.Unlock()
		
		room.pty.Close()
		cmd.Process.Kill()
	}()

	return room, nil
}

func serveTerminalWs(w http.ResponseWriter, r *http.Request) {
	projectId := r.URL.Query().Get("projectId")
	userId := r.URL.Query().Get("userId")

	if projectId == "" || userId == "" {
		http.Error(w, "projectId and userId are required", http.StatusBadRequest)
		return
	}

	conn, err := terminalUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	room, err := getTerminalRoom(userId, projectId)
	if err != nil {
		log.Println("Failed to spawn terminal:", err)
		conn.Close()
		return
	}

	client := &TerminalClient{conn: conn, room: room}

	room.mutex.Lock()
	room.clients[client] = true
	room.mutex.Unlock()

	log.Printf("Terminal Client connected to Project PTY: %s", projectId)

	// Pump inputs from this client strictly into the shared PTY
	go func() {
		defer func() {
			room.mutex.Lock()
			delete(room.clients, client)
			room.mutex.Unlock()
			conn.Close()
		}()

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				break
			}
			
			// We write the raw bytes straight into the bash PTY pseudo-terminal pipe
			room.pty.Write(message)
		}
	}()
}
