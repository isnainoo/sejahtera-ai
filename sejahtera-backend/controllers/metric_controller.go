package controllers

import (
	"net/http"
	"time"

	"sejahtera-backend/models" // Kita gunakan models karena DB ada di sana
	"github.com/gin-gonic/gin"
)

type MetricInput struct {
	Weight float64 `json:"weight" binding:"required"`
	Water  float64 `json:"water" binding:"required"`
	Sleep  float64 `json:"sleep" binding:"required"`
}

func SaveMetric(c *gin.Context) {
	// Ambil user_id dari token JWT
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sesi tidak valid, silakan login kembali"})
		return
	}

	var input MetricInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak sesuai"})
		return
	}

	metric := models.DailyMetric{
		UserID: uint(userID.(float64)), 
		Weight: input.Weight,
		Water:  input.Water,
		Sleep:  input.Sleep,
		Date:   time.Now(),
	}

	// GANTI 'config.DB' menjadi 'models.DB'
	if err := models.DB.Create(&metric).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan metrik harian"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Metrik harian berhasil dicatat!"})
}