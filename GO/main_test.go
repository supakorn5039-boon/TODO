package main

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var app *fiber.App

func setup() {
	app = fiber.New()

	// Mock MongoDB setup
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	collection = client.Database("test_db").Collection("todos")

	// Reset collection before each test
	collection.DeleteMany(context.Background(), bson.M{})

	// Routes
	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodos)
	app.Patch("/api/todos/:id", updateTodos)
	app.Delete("/api/todos/:id", deleteTodos)
}

func TestGetTodos(t *testing.T) {
	setup()

	req := httptest.NewRequest(http.MethodGet, "/api/todos", nil)
	resp, _ := app.Test(req)

	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestCreateTodos(t *testing.T) {
	setup()

	todo := Todo{Body: "Test Todo", Completed: false}
	body, _ := json.Marshal(todo)

	req := httptest.NewRequest(http.MethodPost, "/api/todos", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	var createdTodo Todo
	json.NewDecoder(resp.Body).Decode(&createdTodo)
	assert.NotEmpty(t, createdTodo.ID)
	assert.Equal(t, "Test Todo", createdTodo.Body)
}

func TestUpdateTodos(t *testing.T) {
	setup()

	todo := Todo{Body: "Update Todo", Completed: false}
	result, _ := collection.InsertOne(context.Background(), todo)
	id := result.InsertedID.(primitive.ObjectID).Hex()

	body, _ := json.Marshal(map[string]bool{"completed": true})
	req := httptest.NewRequest(http.MethodPatch, "/api/todos/"+id, bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var updatedTodo Todo
	collection.FindOne(context.Background(), bson.M{"_id": result.InsertedID}).Decode(&updatedTodo)
	assert.True(t, updatedTodo.Completed)
}

func TestDeleteTodos(t *testing.T) {
	setup()

	todo := Todo{Body: "Delete Todo", Completed: false}
	result, _ := collection.InsertOne(context.Background(), todo)
	id := result.InsertedID.(primitive.ObjectID).Hex()

	req := httptest.NewRequest(http.MethodDelete, "/api/todos/"+id, nil)
	resp, _ := app.Test(req)

	assert.Equal(t, http.StatusOK, resp.StatusCode)

	count, _ := collection.CountDocuments(context.Background(), bson.M{"_id": result.InsertedID})
	assert.Equal(t, int64(0), count)
}
