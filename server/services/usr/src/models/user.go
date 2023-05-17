package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Email        string             `json:"email" bson:"email"`
	Username     string             `json:"username" bson:"username"`
	PasswordHash string             `json:"password_hash" bson:"password_hash"`
	Fullname     string             `json:"fullname" bson:"fullname"`
	CreateDate   time.Time          `json:"create_date" bson:"create_date"`
	Premium      bool               `json:"premium" bson:"premium"`
}
