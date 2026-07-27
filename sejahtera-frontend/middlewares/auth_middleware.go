package middlewares

import (
	"fmt"
	"net/http"
	"os"
	"sejahtera-backend/models"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAdmin(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak terautentikasi"})
		c.Abort()
		return
	}

	var user models.User
	if err := models.DB.First(&user, uint(userID.(float64))).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Akses ditolak: User tidak ditemukan"})
		c.Abort()
		return
	}

	if user.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Akses ditolak: Hanya untuk Admin"})
		c.Abort()
		return
	}

	c.Next()
}

func RequireAuth(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak ditemukan, silakan login"})
		c.Abort()
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("metode unexpect: %v", token.Header["alg"])
		}
		jwtSecret := []byte(os.Getenv("JWT_SECRET"))
		if len(jwtSecret) == 0 {
			jwtSecret = []byte("rahasia_sejahtera_ai_2024")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid atau sudah kedaluwarsa"})
		c.Abort()
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		c.Set("user_id", claims["user_id"])
		c.Next()
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Gagal membaca token payload"})
		c.Abort()
		return
	}
}