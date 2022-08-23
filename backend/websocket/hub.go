package websocket

import (
	"encoding/json"
	"strings"
)

type SubscriptionType int16

const (
	AllStats SubscriptionType = iota
	Header
	Overview
	Perks
	GoldStats
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan Message

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	//display
	master *Client
	display []byte
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			/*clientId := client.ID
			for client := range h.clients {
				msg := []byte("some one join room (ID: " + clientId + ")")
				client.send <- msg
			}*/
			h.clients[client] = true

		case client := <-h.unregister:
			//clientId := client.ID
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}

			if h.master == client {
				h.master = nil
				for client := range h.clients {
					client.send <- []byte(`{"type":"display","body":{}}`)
				}
			}
		case userMessage := <-h.broadcast:
			var data map[string][]byte
			
			json.Unmarshal(userMessage.msj, &data)
			for client := range h.clients {
				if strings.Contains(string(data["message"][0:16]), "display") {
					h.master = client
					h.display = data["message"]
				}

				//prevent self receive the message
				if client.ID == string(data["id"]) {
					continue
				}

				select {
				case client.send <- data["message"]:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
