package api

import (
	"net/http"
	"sejahtera-backend/models" 
	"sejahtera-backend/routes" 
	"github.com/gin-gonic/gin"
)

var app *gin.Engine

func init() {
	models.ConnectDatabase()
	
	app = gin.Default()

	app.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	routes.SetupRoutes(app)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}