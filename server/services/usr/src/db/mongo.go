package db

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db *mongo.Database

func Connect(mongoDBHost string, mongoDBPort int, mongoDBUsername string, mongoDBPassword string, mongoDBDatabase string) {
	// Set client options
	clientOptions := options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s@%s:%d/%s",
		mongoDBUsername, mongoDBPassword, mongoDBHost, mongoDBPort, mongoDBDatabase))

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	// Set the database
	db = client.Database(mongoDBDatabase)
}

// GetDB returns the MongoDB database instance
func GetDB() *mongo.Database {
	return db
}