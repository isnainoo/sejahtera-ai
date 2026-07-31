package models

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		fmt.Println("CRITICAL ERROR: Variabel DB_DSN kosong atau tidak terbaca!")
		return 
	}

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("CRITICAL ERROR KONEKSI DATABASE AIVEN:", err)
		return
	}

	err = database.AutoMigrate(
		&User{},
		&UserProfile{},
		&DailyMetric{}, 
		&FoodLog{},
	)
	if err != nil {
		fmt.Println("CRITICAL ERROR MIGRASI DATABASE:", err)
		return
	}

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