const phonebookRouter = require("express").Router();
const Person = require("../models/phonebook");

// CRUD

// Get person
phonebookRouter.get("/", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

phonebookRouter.get("/:id", (request, response) => {
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

phonebookRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((response) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Update person

phonebookRouter.put("/:id", (request, response, next) => {
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
phonebookRouter.post("/", (request, response) => {
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
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => console.log(error));
});

module.exports = phonebookRouter;
