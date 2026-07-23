package models

import (
	"fmt"
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := os.Getenv("DB_DSN")
	
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal terkoneksi ke database:", err)
	}

	err = database.AutoMigrate(
		&User{},
		&UserProfile{},
		&DailyMetric{}, 
		&FoodLog{},
	)
	
	if err != nil {
		log.Fatal("Gagal melakukan migrasi database:", err)
	}

	// Seed default admin if it doesn't exist
	var count int64
	database.Model(&User{}).Where("email = ?", "admin@sejahtera.com").Count(&count)
	if count == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("adminsejahtera"), bcrypt.DefaultCost)
		if err == nil {
			adminUser := User{
				Name:     "Admin Sejahtera",
				Email:    "admin@sejahtera.com",
				Password: string(hashedPassword),
				Age:      30,
				Gender:   "Laki-laki",
				Role:     "admin",
			}
			database.Create(&adminUser)
			fmt.Println("Default admin user created (admin@sejahtera.com / adminsejahtera)")
		}
	}

	fmt.Println("Database berhasil terkoneksi dan tabel telah di-migrate!")
	DB = database
}