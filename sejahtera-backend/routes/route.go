package routes

import (
	"sejahtera-backend/controllers"
	"sejahtera-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		// Grup Endpoint Terproteksi (Wajib Token JWT)
		protected := api.Group("/")
		protected.Use(middlewares.RequireAuth)
		{
			protected.POST("/profile", controllers.SaveProfile)

			// Endpoint AI
			protected.POST("/ai/analyze-food", controllers.AnalyzeFood)
			protected.POST("/ai/generate-recipe", controllers.GenerateRecipe)

			// TAMBAHAN: Endpoint untuk simpan data metrik harian
			protected.POST("/metrics", controllers.SaveMetric)
		}
	}
}