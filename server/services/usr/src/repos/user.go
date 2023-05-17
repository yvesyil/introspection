package repos

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"introspection.cc/usr/src/db"
	"introspection.cc/usr/src/models"
)

const (
	userCollectionName = "users"
)

type UserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository() *UserRepository {
	db := db.GetDB()
	collection := db.Collection(userCollectionName)

	return &UserRepository{
		collection: collection,
	}
}

func (ur *UserRepository) GetUsers() ([]*models.User, error) {
	filter := bson.M{}

	users := []*models.User{}
	cursor, err := ur.collection.Find(context.TODO(), filter)
	if err != nil {
		log.Println("Failed to get users:", err)
		return nil, err
	}

	err = cursor.All(context.Background(), &users)
	if err != nil {
		log.Println("Failed to get users:", err)
		return nil, err
	}

	return users, nil
}

func (ur *UserRepository) CreateUser(user *models.User) (primitive.ObjectID, error) {
	res, err := ur.collection.InsertOne(context.TODO(), user)
	if err != nil {
		log.Println("Failed to create user:", err)
		return primitive.ObjectID{}, err
	}

	return res.InsertedID.(primitive.ObjectID), nil
}

func (ur *UserRepository) GetUserByID(userID primitive.ObjectID) (*models.User, error) {
	filter := bson.M{"_id": userID}

	user := &models.User{}
	err := ur.collection.FindOne(context.TODO(), filter).Decode(user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // User not found
		}
		log.Println("Failed to get user:", err)
		return nil, err
	}

	return user, nil
}

func (ur *UserRepository) UpdateUser(user *models.User) error {
	filter := bson.M{"_id": user.ID}
	update := bson.M{"$set": user}

	_, err := ur.collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		log.Println("Failed to update user:", err)
		return err
	}

	return nil
}

func (ur *UserRepository) DeleteUser(userID primitive.ObjectID) error {
	filter := bson.M{"_id": userID}

	if _, err := ur.collection.DeleteOne(context.TODO(), filter); err != nil {
		log.Println("Failed to delete user:", err)
		return err
	}

	return nil
}