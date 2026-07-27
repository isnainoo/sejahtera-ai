package controllers

import (
	"net/http"
	"sejahtera-backend/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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

func GetProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user models.User

	if err := models.DB.Preload("Profile").First(&user, uint(userID.(float64))).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, user)
}

type UpdateProfileInput struct {
	Name   string  `json:"name"`
	Email  string  `json:"email"`
	Age    int     `json:"age"`
	Gender string  `json:"gender"`
	Height float64 `json:"height"`
}

func UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	var user models.User
	if err := models.DB.First(&user, uint(userID.(float64))).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	user.Name = input.Name
	user.Email = input.Email
	user.Age = input.Age
	user.Gender = input.Gender
	models.DB.Save(&user)

	var profile models.UserProfile
	if err := models.DB.Where("user_id = ?", user.ID).First(&profile).Error; err != nil {
		profile = models.UserProfile{
			UserID: user.ID,
			Age:    input.Age,
			Gender: input.Gender,
			Height: input.Height,
		}
		models.DB.Create(&profile)
	} else {
		profile.Age = input.Age
		profile.Gender = input.Gender
		profile.Height = input.Height
		models.DB.Save(&profile)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profil berhasil diperbarui"})
}

type UpdatePasswordInput struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

func UpdatePassword(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input UpdatePasswordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data tidak valid"})
		return
	}

	var user models.User
	if err := models.DB.First(&user, uint(userID.(float64))).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.OldPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Password saat ini salah!"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	models.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "Password berhasil diubah"})
}
