package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"introspection.cc/usr/src/api/handlers"
	"introspection.cc/usr/src/db"
	"introspection.cc/usr/src/repos"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		panic(err)
	}

	r := gin.Default()

	port := os.Getenv("PORT")

	db.Connect(os.Getenv("MONGODB_HOST"), 27017, os.Getenv("MONGODB_USERNAME"), os.Getenv("MONGODB_PASSWORD"), os.Getenv("MONGODB_DATABASE"))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	api := r.Group("/api")
	{
		user := api.Group("/users")
		{
			uh := handlers.NewUserHandler(repos.NewUserRepository())
			user.GET("/", uh.GetUsers)
			user.GET("/:id", uh.GetUserByID)
			user.POST("/", uh.CreateUser)
			user.PUT("/:id", uh.UpdateUser)
			user.DELETE("/:id", uh.DeleteUser)
		}
	}

	r.Run(":" + port)
}
