package controllers

import (
	"net/http"
	"sejahtera-backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func AdminGetUsers(c *gin.Context) {
	var users []models.User
	if err := models.DB.Preload("Profile").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data user"})
		return
	}

	c.JSON(http.StatusOK, users)
}

type AdminCreateUserInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Age      int    `json:"age" binding:"required"`
	Gender   string `json:"gender" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

func AdminCreateUser(c *gin.Context) {
	var input AdminCreateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal enkripsi password"})
		return
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashedPassword),
		Age:      input.Age,
		Gender:   input.Gender,
		Role:     input.Role,
	}

	if err := models.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email sudah terdaftar atau terjadi kesalahan"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User berhasil dibuat", "data": user})
}

type AdminUpdateUserInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password"` 
	Age      int    `json:"age" binding:"required"`
	Gender   string `json:"gender" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

func AdminUpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	userID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	var input AdminUpdateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.First(&user, uint(userID)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	user.Name = input.Name
	user.Email = input.Email
	user.Age = input.Age
	user.Gender = input.Gender
	user.Role = input.Role

	if input.Password != "" {
		if len(input.Password) < 8 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Password minimal harus 8 karakter"})
			return
		}
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal enkripsi password baru"})
			return
		}
		user.Password = string(hashedPassword)
	}

	if err := models.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gagal memperbarui user. Email mungkin sudah digunakan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User berhasil diperbarui", "data": user})
}

func AdminDeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	userIDToDelete, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return
	}

	currentUserIDClaim, exists := c.Get("user_id")
	if exists {
		currID := uint(currentUserIDClaim.(float64))
		if currID == uint(userIDToDelete) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Anda tidak dapat menghapus akun Anda sendiri"})
			return
		}
	}

	var user models.User
	if err := models.DB.First(&user, uint(userIDToDelete)).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	if err := models.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User berhasil dihapus"})
}
