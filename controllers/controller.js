const router = require("express").Router();
const model = require("../models/model");

// Check item model in line 46 , 71

// CRUD

// Get item
router.get("/", (request, response) => {
  model.find({}).then((item) => {
    response.json(item);
  });
});

router.get("/:id", (request, response, next) => {
  model
    .findById(request.params.id)
    .then((item) => {
      if (item) {
        response.json(item);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// Delete item

router.delete("/:id", (request, response, next) => {
  model
    .findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Update item

router.put("/:id", (request, response, next) => {
  const body = request.body;

  const item = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  model
    .findByIdAndUpdate(request.params.id, item, { new: true })
    .then((updatedmodel) => {
      response.json(updatedmodel);
    })
    .catch((error) => next(error));
});

// Create new item post
router.post("/", (request, response) => {
  const body = request.body;

  if (!body.title || !body.author || !body.url || !body.likes) {
    return response.status(400).json({
      error: "Info missing",
    });
  }

  const item = new model({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  // Save into MongoDB
  item
    .save()
    .then((savedmodel) => {
      response.json(savedmodel);
    })
    .catch((error) => console.log(error));
});

module.exports = router;
