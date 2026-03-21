package main

import "log"

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

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			room, ok := h.rooms[client.roomID]
			if !ok {
				room = &Room{
					id:      client.roomID,
					clients: make(map[*Client]bool),
					history: make([][]byte, 0),
				}
				h.rooms[client.roomID] = room
				log.Printf("Created room: %s", client.roomID)
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
						log.Printf("Room %s is now empty (history retained in memory)", client.roomID)
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
		}
	}
}
