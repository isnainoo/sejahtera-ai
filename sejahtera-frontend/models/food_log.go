package models

import "time"

type FoodLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Breakfast string    `json:"breakfast"`
	Lunch     string    `json:"lunch"`
	Dinner    string    `json:"dinner"`
	Analysis  string    `gorm:"type:text" json:"analysis"`
	Date      time.Time `json:"date"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}