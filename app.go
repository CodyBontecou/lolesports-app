package main

import (
	"changeme/backend/websocket"
	"context"
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Start gin server with websocket
func (a *App) StartServer() {
	r := gin.Default()
	hub := websocket.NewHub()
	go hub.Run()

	r.Use(cors.Default())

	r.GET("/ping", func(c *gin.Context) {
		println("ping pong")
		c.JSON(http.StatusOK, gin.H{
			"message": "pong1",
		})
	})

	r.GET("/", func(c *gin.Context) {
		println("Connecting to websocket")
		websocket.ServeWs(hub, c)
	})

	r.Run(":34920")

}