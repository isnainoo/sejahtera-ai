package controllers

import (
	"fmt"
	"net/http"
	"sejahtera-backend/models"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type MetricInput struct {
	Weight float64 `json:"weight" binding:"required"`
	Water  float64 `json:"water" binding:"required"`
	Sleep  float64 `json:"sleep" binding:"required"`
}

func generateAIAnalysisForMetric(weight, water, sleep float64) string {
	prompt := fmt.Sprintf(`Anda adalah asisten kesehatan AI. Analisis metrik pengguna hari ini: 
	- Berat: %.1f kg
	- Minum: %.1f L (Target 2.5L)
	- Tidur: %.1f jam (Target 7-8 jam)
	
	Berikan 2 poin analisis personal. 
	Format HARUS JSON murni berupa array persis seperti ini tanpa markdown, tanpa awalan, tanpa akhiran:
	[
	  {"icon": "check", "title": "Judul positif (maks 4 kata)", "description": "Penjelasan mendalam..."},
	  {"icon": "trend", "title": "Judul progres (maks 4 kata)", "description": "Penjelasan dampak..."}
	]`, weight, water, sleep)

	aiResponseText, err := callAlternativeAPI(prompt)
	if err != nil {
		return `[{"icon": "trend", "title": "Analisis Tertunda", "description": "Gagal terhubung ke AI. Silakan edit kembali metrik Anda nanti."}]`
	}

	startIndex := strings.Index(aiResponseText, "[")
	endIndex := strings.LastIndex(aiResponseText, "]")
	if startIndex != -1 && endIndex != -1 && endIndex > startIndex {
		return aiResponseText[startIndex : endIndex+1]
	}

	return aiResponseText
}

func SaveMetric(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input MetricInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak sesuai"})
		return
	}

	analysisResult := generateAIAnalysisForMetric(input.Weight, input.Water, input.Sleep)

	metric := models.DailyMetric{
		UserID:   uint(userID.(float64)),
		Weight:   input.Weight,
		Water:    input.Water,
		Sleep:    input.Sleep,
		Analysis: analysisResult,
		Date:     time.Now(),
	}

	if err := models.DB.Create(&metric).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan metrik"})
		return
	}

	c.JSON(http.StatusOK, metric)
}

func GetMetrics(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var metrics []models.DailyMetric

	if err := models.DB.Where("user_id = ?", uint(userID.(float64))).
		Order("date desc").Find(&metrics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil riwayat"})
		return
	}

	c.JSON(http.StatusOK, metrics)
}

func UpdateMetric(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	var metric models.DailyMetric
	if err := models.DB.Where("id = ? AND user_id = ?", id, uint(userID.(float64))).First(&metric).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data metrik tidak ditemukan"})
		return
	}

	var input MetricInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak sesuai"})
		return
	}

	analysisResult := generateAIAnalysisForMetric(input.Weight, input.Water, input.Sleep)

	metric.Weight = input.Weight
	metric.Water = input.Water
	metric.Sleep = input.Sleep
	metric.Analysis = analysisResult

	if err := models.DB.Save(&metric).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui metrik"})
		return
	}

	c.JSON(http.StatusOK, metric)
}
