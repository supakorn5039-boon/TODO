package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Todo struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Completed bool               `json:"completed"`
	Body      string             `json:"body"`
}

var collection *mongo.Collection

func main() {
	fmt.Println("hello world")

	if os.Getenv("ENV") != "production" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file:", err)
		}
	}

	MONGO_URL := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGO_URL)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB")
	collection = client.Database("golang_db").Collection("todos")

	app := fiber.New()

	if os.Getenv("ENV") == "production" {
		// Allow all origins in production (adjust as needed)
		app.Use(cors.New(cors.Config{
			AllowOrigins: "*", // Adjust for production if necessary
			AllowMethods: "GET, POST, PATCH, DELETE",
			AllowHeaders: "Content-Type",
		}))
	} else {
		// Allow only specific origins during development
		app.Use(cors.New(cors.Config{
			AllowOrigins: "http://localhost:3000",
			AllowMethods: "GET, POST, PATCH, DELETE",
			AllowHeaders: "Content-Type",
		}))
	}

	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodos)
	app.Patch("/api/todos/:id", updateTodos)
	app.Delete("/api/todos/:id", deleteTodos)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if os.Getenv("ENV") == "production" {
		app.Static("/", "../client/dist")
	}
	log.Fatal(app.Listen("0.0.0.0:" + port))
}

func getTodos(c *fiber.Ctx) error {
	var todos []Todo
	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var todo Todo
		if err := cursor.Decode(&todo); err != nil {
			return err
		}
		todos = append(todos, todo)
	}
	return c.JSON(todos)
}

func createTodos(c *fiber.Ctx) error {
	todo := new(Todo)

	if err := c.BodyParser(todo); err != nil {
		return err
	}
	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo body can't be empty"})
	}
	insertResult, err := collection.InsertOne(context.Background(), todo)
	if err != nil {
		return err
	}

	todo.ID = insertResult.InsertedID.(primitive.ObjectID)
	return c.Status(201).JSON(todo)
}

func updateTodos(c *fiber.Ctx) error {
	id := c.Params("id")
	ObjectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": ObjectID}
	update := bson.M{"$set": bson.M{"completed": true}}

	_, err = collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success": true})
}

func deleteTodos(c *fiber.Ctx) error {
	id := c.Params("id")
	objecID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}
	filter := bson.M{"_id": objecID}
	_, err = collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success": true})
}
