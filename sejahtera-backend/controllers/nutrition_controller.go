package controllers

import (
	"fmt"
	"net/http"
	"time"

	"sejahtera-backend/models"
	"github.com/gin-gonic/gin"
)

type DailyFoodInput struct {
	Breakfast string `json:"breakfast"`
	Lunch     string `json:"lunch"`
	Dinner    string `json:"dinner"`
}

func generateAIAnalysisForFood(breakfast, lunch, dinner string) string {
	if breakfast == "" { breakfast = "Belum diisi" }
	if lunch == "" { lunch = "Belum diisi" }
	if dinner == "" { dinner = "Belum diisi" }

	prompt := fmt.Sprintf(`Anda adalah ahli gizi AI. Analisis sesi makan ini:
	- Pagi: %s
	- Siang: %s
	- Malam: %s

	ATURAN PENTING: Jika sesi makan tertulis "Belum diisi", berikan nilai 0 untuk kalori, protein, karbohidrat, dan lemak pada sesi tersebut.

	Berikan hasil dalam format JSON murni (tanpa markdown/backtick) dengan struktur persis seperti ini:
	{
	  "meals": {
		"pagi": {"kalori": 300, "protein": 10, "karbohidrat": 40, "lemak": 10},
		"siang": {"kalori": 500, "protein": 25, "karbohidrat": 60, "lemak": 15},
		"malam": {"kalori": 400, "protein": 20, "karbohidrat": 30, "lemak": 15}
	  },
	  "summary": {
		"total_kalori": 1200,
		"total_protein": 55,
		"total_karbohidrat": 130,
		"total_lemak": 40,
		"insight": "Penjelasan 2 kalimat tentang nutrisi...",
		"rekomendasi_besok": ["Saran 1", "Saran 2"]
	  }
	}`, breakfast, lunch, dinner)

	aiResponseText, err := callGeminiAPI(prompt)
	if err != nil {
		return `{"error": "Gagal terhubung ke AI. Silakan edit kembali nanti."}`
	}
	return aiResponseText
}

func SaveFoodLog(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input DailyFoodInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak sesuai"})
		return
	}

	analysisResult := generateAIAnalysisForFood(input.Breakfast, input.Lunch, input.Dinner)

	foodLog := models.FoodLog{
		UserID:    uint(userID.(float64)),
		Breakfast: input.Breakfast,
		Lunch:     input.Lunch,
		Dinner:    input.Dinner,
		Analysis:  analysisResult,
		Date:      time.Now(),
	}

	if err := models.DB.Create(&foodLog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan riwayat makan"})
		return
	}
	c.JSON(http.StatusOK, foodLog)
}

func GetFoodLogs(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var logs []models.FoodLog

	if err := models.DB.Where("user_id = ?", uint(userID.(float64))).
		Order("date desc").Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil riwayat"})
		return
	}
	c.JSON(http.StatusOK, logs)
}

func UpdateFoodLog(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	var foodLog models.FoodLog
	if err := models.DB.Where("id = ? AND user_id = ?", id, uint(userID.(float64))).First(&foodLog).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
		return
	}

	var input DailyFoodInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak sesuai"})
		return
	}

	analysisResult := generateAIAnalysisForFood(input.Breakfast, input.Lunch, input.Dinner)

	foodLog.Breakfast = input.Breakfast
	foodLog.Lunch = input.Lunch
	foodLog.Dinner = input.Dinner
	foodLog.Analysis = analysisResult

	if err := models.DB.Save(&foodLog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui riwayat makan"})
		return
	}
	c.JSON(http.StatusOK, foodLog)
}