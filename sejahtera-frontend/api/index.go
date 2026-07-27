package api

import (
	"net/http"
	"sejahtera-backend/models" // Sesuaikan "sejahtera-backend" dengan nama module di go.mod Anda
	"sejahtera-backend/routes" // Sesuaikan "sejahtera-backend" dengan nama module di go.mod Anda

	"github.com/gin-gonic/gin"
)

var app *gin.Engine

// Fungsi init berjalan otomatis saat serverless Vercel "terbangun"
func init() {
	// Koneksi ke database (Pastikan kode godotenv.Load() di setup.go tidak menghentikan aplikasi jika file .env tidak ada)
	models.ConnectDatabase()
	
	app = gin.Default()

	// Pengaturan CORS
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

	// Panggil semua rute API
	routes.SetupRoutes(app)
}

// Fungsi Handler ini adalah "Jembatan" antara Vercel dan Gin Golang
func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}