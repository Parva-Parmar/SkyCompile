package main

import (
	"log"
	"net/http"
)

func main() {
	hub := newHub()
	go hub.run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	http.HandleFunc("/terminal", serveTerminalWs)

	log.Println("SkyCompile Real-Time Collaboration Server starting on :8082")
	err := http.ListenAndServe(":8082", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
