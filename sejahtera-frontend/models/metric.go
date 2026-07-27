package models

import "time"

type DailyMetric struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Weight    float64   `json:"weight"`
	Water     float64   `json:"water"`
	Sleep     float64   `json:"sleep"`
	Analysis  string    `gorm:"type:text" json:"analysis"`
	Date      time.Time `json:"date"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}