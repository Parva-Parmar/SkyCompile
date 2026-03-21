package main

import (
	"encoding/binary"
	"log"
	"os"
	"path/filepath"
	"time"
)

const snapshotsDir = ".yjs_snapshots"

func init() {
	if err := os.MkdirAll(snapshotsDir, 0755); err != nil {
		log.Printf("Failed to create snapshots directory: %v", err)
	}
}

// Room holds the state and connected clients for a specific document
type Room struct {
	id      string
	clients map[*Client]bool
	history [][]byte // Raw Yjs updates
}

type Hub struct {
	rooms      map[string]*Room
	register   chan *Client
	unregister chan *Client
	broadcast  chan BroadcastMessage
}

type BroadcastMessage struct {
	roomID  string
	sender  *Client
	message []byte
}

func newHub() *Hub {
	return &Hub{
		rooms:      make(map[string]*Room),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan BroadcastMessage),
	}
}

func loadSnapshot(roomID string) [][]byte {
	path := filepath.Join(snapshotsDir, roomID+".bin")
	data, err := os.ReadFile(path)
	if err != nil {
		return make([][]byte, 0) // No snapshot exists (or error reading)
	}

	var history [][]byte
	// Parse length-prefixed raw bytes back into [][]byte
	offset := 0
	for offset < len(data) {
		if offset+4 > len(data) {
			break
		}
		length := int(binary.BigEndian.Uint32(data[offset : offset+4]))
		offset += 4
		if offset+length > len(data) {
			break
		}
		history = append(history, data[offset : offset+length])
		offset += length
	}
	return history
}

func saveSnapshots(rooms map[string]*Room) {
	var totalMem int
	for roomID, room := range rooms {
		path := filepath.Join(snapshotsDir, roomID+".bin")
		file, err := os.Create(path)
		if err != nil {
			log.Printf("Error creating snapshot for %s: %v", roomID, err)
			continue
		}

		roomMem := 0
		for _, update := range room.history {
			lenBuf := make([]byte, 4)
			binary.BigEndian.PutUint32(lenBuf, uint32(len(update)))
			file.Write(lenBuf)
			file.Write(update)
			roomMem += len(update)
		}
		file.Close()
		totalMem += roomMem
		log.Printf("[Heartbeat] Room %s: %d clients, %d total updates, %d bytes in memory", roomID, len(room.clients), len(room.history), roomMem)
	}
	if len(rooms) > 0 {
		log.Printf("[Heartbeat] TOTAL YJS MEMORY USAGE: %d bytes across %d active rooms", totalMem, len(rooms))
	}
}

func (h *Hub) run() {
	// Periodic routine to flush snapshot states to the disk every 30 seconds
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case client := <-h.register:
			room, ok := h.rooms[client.roomID]
			if !ok {
				// Load historical footprint from disk if the Go server had completely crashed / rebooted recently
				history := loadSnapshot(client.roomID)
				room = &Room{
					id:      client.roomID,
					clients: make(map[*Client]bool),
					history: history,
				}
				h.rooms[client.roomID] = room
				log.Printf("Created room: %s (Loaded %d historical updates from disk snapshot)", client.roomID, len(history))
			}
			room.clients[client] = true
			log.Printf("Client connected to room: %s", client.roomID)

			// Send the entire document history to the new client
			for _, update := range room.history {
				client.send <- update
			}

		case client := <-h.unregister:
			if room, ok := h.rooms[client.roomID]; ok {
				if _, ok := room.clients[client]; ok {
					delete(room.clients, client)
					close(client.send)
					log.Printf("Client disconnected from room: %s", client.roomID)
					if len(room.clients) == 0 {
						log.Printf("Room %s is now empty (history retained in memory until server restarts. Snapshot safe on disk)", client.roomID)
					}
				}
			}

		case bm := <-h.broadcast:
			if room, ok := h.rooms[bm.roomID]; ok {
				// Y-Websocket protocol: MessageSync = 0, MessageAwareness = 1
				// Only save document updates to history to prevent memory bloat from cursor movements
				if len(bm.message) > 0 && bm.message[0] == 0 {
					room.history = append(room.history, bm.message)
				}

				for client := range room.clients {
					if client != bm.sender {
						select {
						case client.send <- bm.message:
						default:
							close(client.send)
							delete(room.clients, client)
						}
					}
				}
			}

		// Snapshot Ticker Trigger
		case <-ticker.C:
			saveSnapshots(h.rooms)
		}
	}
}
