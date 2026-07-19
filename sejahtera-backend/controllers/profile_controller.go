package controllers

import (
	"net/http"
	"sejahtera-backend/models"

	"github.com/gin-gonic/gin"
)

type ProfileInput struct {
	Age            int     `json:"age" binding:"required"`
	Gender         string  `json:"gender" binding:"required"`
	Height         float64 `json:"height" binding:"required"`
	Weight         float64 `json:"weight" binding:"required"`
	ActivityLevel  string  `json:"activity_level" binding:"required"`
	SleepTarget    float64 `json:"sleep_target" binding:"required"`
	HealthTarget   string  `json:"health_target" binding:"required"`
	DietPreference string  `json:"diet_preference"`
}

func SaveProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak terautentikasi"})
		return
	}

	var input ProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uID := uint(userID.(float64))

	var profile models.UserProfile
	if err := models.DB.Where("user_id = ?", uID).First(&profile).Error; err != nil {
		profile = models.UserProfile{
			UserID:         uID,
			Age:            input.Age,
			Gender:         input.Gender,
			Height:         input.Height,
			Weight:         input.Weight,
			ActivityLevel:  input.ActivityLevel,
			SleepTarget:    input.SleepTarget,
			HealthTarget:   input.HealthTarget,
			DietPreference: input.DietPreference,
		}
		models.DB.Create(&profile)
	} else {
		profile.Age = input.Age
		profile.Gender = input.Gender
		profile.Height = input.Height
		profile.Weight = input.Weight
		profile.ActivityLevel = input.ActivityLevel
		profile.SleepTarget = input.SleepTarget
		profile.HealthTarget = input.HealthTarget
		profile.DietPreference = input.DietPreference
		models.DB.Save(&profile)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profil kesehatan berhasil disimpan!",
		"data":    profile,
	})
}
