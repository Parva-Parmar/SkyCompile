package main

import (
	"log"
	"net/http"
)

func main() {
	hub := newHub()
	go hub.run()

	// Health check endpoint
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"UP","service":"SkyCompile Go Backend","version":"1.0.0"}`))
	})

	http.HandleFunc("/ws/", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	http.HandleFunc("/terminal", serveTerminalWs)
	http.HandleFunc("/api/v1/projects/", AuthMiddleware(handleFileApi))

	log.Println("SkyCompile Real-Time Collaboration Server starting on :8082")
	err := http.ListenAndServe(":8082", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
