require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/phonebook");

const app = express();
app.use(express.json());

// Middleware

// Log the method and url
const morganMid = morgan(
  ":method :url :status :res[content-length] - :response-time ms :res[header]"
);
app.use(morganMid);

// Connect frontend and backend
const cors = require("cors");

app.use(cors());

// CRUD

// General routes
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  response.send(`
  <h1>Phonebook has info for ${Person.length} people </h1>
  <h1> ${new Date()}</h1>
  <h1> ${JSON.stringify(Person)}</h1>
  `);
});

// Get person
app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
    // response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// Delete person

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Update person

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Create new person
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  // Save into MongoDB
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// Error handler

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

// Export
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
