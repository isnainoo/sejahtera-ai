package models

import (
	"time"
)

type User struct {
	ID        uint          `gorm:"primaryKey" json:"id"`
	Name      string        `gorm:"size:100;not null" json:"name"`
	Email     string        `gorm:"size:100;uniqueIndex;not null" json:"email"`
	Password  string        `gorm:"not null" json:"-"`
	
	Profile   UserProfile   `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"profile"`
	Metrics   []DailyMetric `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"metrics"`
	FoodLogs  []FoodLog     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"food_logs"`
	
	CreatedAt time.Time     `json:"created_at"`
	UpdatedAt time.Time     `json:"updated_at"`
}

type UserProfile struct {
	ID             uint    `gorm:"primaryKey" json:"id"`
	UserID         uint    `gorm:"uniqueIndex;not null" json:"user_id"`
	Age            int     `json:"age"`
	Gender         string  `gorm:"size:20" json:"gender"`
	Height         float64 `json:"height"`
	Weight         float64 `json:"weight"` 
	ActivityLevel  string  `gorm:"size:50" json:"activity_level"` 
	SleepTarget    float64 `json:"sleep_target"` 
	HealthTarget   string  `gorm:"size:100" json:"health_target"`
	DietPreference string  `gorm:"size:100" json:"diet_preference"`
}