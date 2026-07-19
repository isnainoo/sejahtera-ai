package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings" 

	"github.com/gin-gonic/gin"
)

type FoodInput struct {
	FoodName string `json:"food_name" binding:"required"`
}

type RecipeInput struct {
	Ingredients string `json:"ingredients" binding:"required"`
}

type GeminiRequest struct {
	Contents []Content `json:"contents"`
}

type Content struct {
	Parts []Part `json:"parts"`
}

type Part struct {
	Text string `json:"text"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

func callGeminiAPI(prompt string) (string, error) {
	apiKey := strings.TrimSpace(os.Getenv("GEMINI_API_KEY"))

	modelName := "gemini-flash-latest"
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", modelName, apiKey)

	reqBody := GeminiRequest{
		Contents: []Content{{Parts: []Part{{Text: prompt}}}},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	fmt.Println("RESPONS DARI GEMINI:", string(bodyBytes))

	var geminiResp GeminiResponse
	if err := json.Unmarshal(bodyBytes, &geminiResp); err != nil {
		return "", err
	}

	if len(geminiResp.Candidates) > 0 && len(geminiResp.Candidates[0].Content.Parts) > 0 {
		return geminiResp.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("respons kosong dari AI")
}

func AnalyzeFood(c *gin.Context) {
	var input FoodInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := fmt.Sprintf(`Anda adalah ahli gizi. Analisis makanan berikut: "%s". 
	Berikan estimasi kandungan nutrisi per porsi standar. 
	Format jawaban HARUS berupa JSON murni (tanpa block markdown / backtick) dengan struktur persis seperti ini:
	{"kalori": 250, "protein": 10, "karbohidrat": 30, "lemak": 5, "serat": 3, "rekomendasi_menu_berikutnya": "Rekomendasi makanan..."}`, input.FoodName)

	aiResponseText, err := callGeminiAPI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses data dengan AI"})
		return
	}

	c.Data(http.StatusOK, "application/json", []byte(aiResponseText))
}

func GenerateRecipe(c *gin.Context) {
	var input RecipeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := fmt.Sprintf(`Buatkan 1 resep masakan sehat menggunakan bahan-bahan berikut: %s. 
	Format jawaban HARUS JSON murni tanpa block markdown dengan struktur:
	{"nama_hidangan": "Nama", "bahan_tambahan": ["Bahan 1"], "langkah_memasak": ["Langkah 1", "Langkah 2"], "estimasi_kalori": 300}`, input.Ingredients)

	aiResponseText, err := callGeminiAPI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses resep dengan AI"})
		return
	}

	c.Data(http.StatusOK, "application/json", []byte(aiResponseText))
}

type MetricAnalysisInput struct {
	Weight float64 `json:"weight" binding:"required"`
	Water  float64 `json:"water" binding:"required"`
	Sleep  float64 `json:"sleep" binding:"required"`
}

func AnalyzeMetrics(c *gin.Context) {
	var input MetricAnalysisInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := fmt.Sprintf(`Anda adalah asisten kesehatan holistik AI yang cerdas. 
	Analisis metrik harian pengguna hari ini: 
	- Berat badan: %.1f kg
	- Minum air: %.1f Liter (Target standar harian 2.5L)
	- Tidur: %.1f jam (Target standar harian 7-8 jam)
	
	Berikan 2 poin analisis yang sangat personal, memotivasi, dan berkesan 'pintar'. Kaitkan metrik tersebut dengan efek biologis atau psikologis (contoh: fokus kognitif, metabolisme, regenerasi sel).
	
	Format jawaban HARUS JSON murni berupa array (tanpa block markdown / backtick) dengan struktur persis seperti ini:
	[
	  {"icon": "check", "title": "Judul positif (maks 4 kata)", "description": "Penjelasan mendalam dan memotivasi... (maks 2 kalimat)"},
	  {"icon": "trend", "title": "Judul progres (maks 4 kata)", "description": "Penjelasan dampak fisiologis dari data... (maks 2 kalimat)"}
	]
	Gunakan nilai "check" jika metrik mendekati/mencapai ideal, atau "trend" jika metrik menunjukkan perlunya peningkatan atau adaptasi.`, input.Weight, input.Water, input.Sleep)

	aiResponseText, err := callGeminiAPI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menganalisis metrik dengan AI"})
		return
	}

	c.Data(http.StatusOK, "application/json", []byte(aiResponseText))
}