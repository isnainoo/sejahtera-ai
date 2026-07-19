package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings" // Tambahan library untuk membersihkan teks

	"github.com/gin-gonic/gin"
)

// Struct Input dari Frontend
type FoodInput struct {
	FoodName string `json:"food_name" binding:"required"`
}

type RecipeInput struct {
	Ingredients string `json:"ingredients" binding:"required"`
}

// Struct untuk Request HTTP ke Gemini
type GeminiRequest struct {
	Contents []Content `json:"contents"`
}

type Content struct {
	Parts []Part `json:"parts"`
}

type Part struct {
	Text string `json:"text"`
}

// Struct untuk Parsing Response HTTP dari Gemini
type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

// Fungsi Helper untuk memanggil Gemini API
func callGeminiAPI(prompt string) (string, error) {
	// TrimSpace akan menghapus karakter spasi/enter tersembunyi dari file .env
	apiKey := strings.TrimSpace(os.Getenv("GEMINI_API_KEY"))

	// Menggunakan model Gemini 2.5 Flash yang tersedia di akun Anda
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

	// Memunculkan respons di terminal backend untuk proses debugging
	fmt.Println("RESPONS DARI GEMINI:", string(bodyBytes))

	// Ekstrak teks balasan dari struktur JSON Gemini
	var geminiResp GeminiResponse
	if err := json.Unmarshal(bodyBytes, &geminiResp); err != nil {
		return "", err
	}

	if len(geminiResp.Candidates) > 0 && len(geminiResp.Candidates[0].Content.Parts) > 0 {
		return geminiResp.Candidates[0].Content.Parts[0].Text, nil
	}

	return "", fmt.Errorf("respons kosong dari AI")
}

// Endpoint 1: Analisis Nutrisi Makanan
func AnalyzeFood(c *gin.Context) {
	var input FoodInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Prompt Engineering: Memaksa AI menjawab JSON mentah
	prompt := fmt.Sprintf(`Anda adalah ahli gizi. Analisis makanan berikut: "%s". 
	Berikan estimasi kandungan nutrisi per porsi standar. 
	Format jawaban HARUS berupa JSON murni (tanpa block markdown / backtick) dengan struktur persis seperti ini:
	{"kalori": 250, "protein": 10, "karbohidrat": 30, "lemak": 5, "serat": 3, "rekomendasi_menu_berikutnya": "Rekomendasi makanan..."}`, input.FoodName)

	aiResponseText, err := callGeminiAPI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses data dengan AI"})
		return
	}

	// Kirim langsung string JSON dari AI ke frontend
	c.Data(http.StatusOK, "application/json", []byte(aiResponseText))
}

// Endpoint 2: Rekomendasi Resep Otomatis
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
