package models

import (
	"time"
)

type FoodLog struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"index;not null" json:"user_id"`
	Date        time.Time `gorm:"type:date;not null" json:"date"`
	FoodName    string    `gorm:"size:255;not null" json:"food_name"`
	Calories    float64   `json:"calories"`
	Protein     float64   `json:"protein"`
	Carbs       float64   `json:"carbs"`   
	Fat         float64   `json:"fat"`     
	Fiber       float64   `json:"fiber"`   
	CreatedAt   time.Time `json:"created_at"`
}