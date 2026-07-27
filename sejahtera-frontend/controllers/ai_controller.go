package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

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

func callAlternativeAPI(prompt string) (string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")

	url := "https://api.groq.com/openai/v1/chat/completions"

	reqBody := map[string]interface{}{
		"model": "llama-3.1-8b-instant",
		"messages": []map[string]interface{}{
			{"role": "system", "content": "You are a helpful API that outputs only pure JSON."},
			{"role": "user", "content": prompt},
		},
		"temperature":     0.5,
		"response_format": map[string]string{"type": "json_object"},
	}

	jsonData, _ := json.Marshal(reqBody)

	var lastErr error
	for i := 0; i < 3; i++ {
		req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
		if err != nil {
			return "", err
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+apiKey)

		client := &http.Client{Timeout: 15 * time.Second}
		resp, err := client.Do(req)

		if err != nil {
			lastErr = err
			time.Sleep(time.Duration(i+2) * time.Second)
			continue
		}

		bodyBytes, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		if resp.StatusCode == http.StatusOK {
			var aiResp struct {
				Choices []struct {
					Message struct {
						Content string `json:"content"`
					} `json:"message"`
				} `json:"choices"`
			}

			if err := json.Unmarshal(bodyBytes, &aiResp); err != nil {
				return "", err
			}

			if len(aiResp.Choices) > 0 {
				return aiResp.Choices[0].Message.Content, nil
			}
		}

		lastErr = fmt.Errorf("Status %d | Penjelasan Groq: %s", resp.StatusCode, string(bodyBytes))
		fmt.Println("🚨 DETAIL ERROR GROQ:", lastErr)

		time.Sleep(2 * time.Second)
	}

	return "", lastErr
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

	aiResponseText, err := callAlternativeAPI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses data dengan AI, server mungkin sedang sibuk."})
		return
	}

	c.Data(http.StatusOK, "application/json", []byte(aiResponseText))
}

func GenerateRecipe(c *gin.Context) {
	var input RecipeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bahan makanan tidak boleh kosong"})
		return
	}

	prompt := fmt.Sprintf(`Anda adalah koki AI profesional. Buat 1 resep sehat berdasarkan bahan ini: %s.
	Format respons WAJIB JSON murni (tanpa markdown/backtick) persis seperti ini:
	{
		"nama_hidangan": "Nama Masakan",
		"estimasi_kalori": 450,
		"bahan_tambahan": ["Bahan 1", "Bahan 2"],
		"langkah_memasak": ["Langkah 1", "Langkah 2"]
	}`, input.Ingredients)

	aiResponseText, err := callAlternativeAPI(prompt)

	if err != nil {
		fmt.Println("🚨 ERROR DARI GROQ:", err)
		fallbackJSON := gin.H{
			"nama_hidangan":   "Sistem AI Sedang Sibuk 🚦",
			"estimasi_kalori": 0,
			"bahan_tambahan":  []string{"Server AI sedang mengalami antrean."},
			"langkah_memasak": []string{
				"Sistem kami sudah mencoba menghubungi ulang otomatis, namun server masih penuh.",
				"Silakan tunggu sekitar 30 detik agar batas antrean mereda.",
				"Klik tombol 'Buat Resep Otomatis' kembali.",
			},
		}
		c.JSON(http.StatusOK, fallbackJSON)
		return
	}

	var recipeData map[string]interface{}
	if err := json.Unmarshal([]byte(aiResponseText), &recipeData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membaca respons dari AI"})
		return
	}

	c.JSON(http.StatusOK, recipeData)
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

	aiResponseText, err := callAlternativeAPI(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menganalisis metrik dengan AI"})
		return
	}

	c.Data(http.StatusOK, "application/json", []byte(aiResponseText))
}
