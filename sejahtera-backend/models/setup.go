package models

import (
	"fmt"
	"log"
	"os"

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

	// Menambahkan DailyMetric ke sini agar tabel otomatis terbuat
	err = database.AutoMigrate(
		&User{},
		&UserProfile{},
		&DailyMetric{}, 
		&FoodLog{},
	)
	
	if err != nil {
		log.Fatal("Gagal melakukan migrasi database:", err)
	}

	fmt.Println("Database berhasil terkoneksi dan tabel telah di-migrate!")
	DB = database
}