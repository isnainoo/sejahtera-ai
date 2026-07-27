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
			auth.POST("/reset-password", controllers.ResetPassword)
		}

		protected := api.Group("/")
		protected.Use(middlewares.RequireAuth)
		{
			protected.POST("/profile", controllers.SaveProfile)           
			protected.GET("/profile", controllers.GetProfile)             
			protected.PUT("/profile", controllers.UpdateProfile)          
			protected.PUT("/profile/password", controllers.UpdatePassword)

			protected.POST("/ai/analyze-food", controllers.AnalyzeFood)
			protected.POST("/ai/generate-recipe", controllers.GenerateRecipe)
			
			protected.POST("/food-logs", controllers.SaveFoodLog)
			protected.GET("/food-logs", controllers.GetFoodLogs)
			protected.PUT("/food-logs/:id", controllers.UpdateFoodLog)

			protected.POST("/metrics", controllers.SaveMetric)
			protected.GET("/metrics", controllers.GetMetrics)
			protected.PUT("/metrics/:id", controllers.UpdateMetric)
		}

		admin := api.Group("/admin")
		admin.Use(middlewares.RequireAuth, middlewares.RequireAdmin)
		{
			admin.GET("/users", controllers.AdminGetUsers)
			admin.POST("/users", controllers.AdminCreateUser)
			admin.PUT("/users/:id", controllers.AdminUpdateUser)
			admin.DELETE("/users/:id", controllers.AdminDeleteUser)
		}
	}
}