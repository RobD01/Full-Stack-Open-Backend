const router = require("express").Router();
const model = require("../models/model");

// Check item model in line 46 , 71

// CRUD

// Get item
router.get("/", async (request, response) => {
  await model.find({}).then((item) => {
    response.json(item);
  });
});

router.get("/:id", async (request, response, next) => {
  await model.findById(request.params.id).then((item) => {
    if (item) {
      response.json(item);
    } else {
      response.status(404).end();
    }
  });
});

// Delete item

router.delete("/:id", async (request, response, next) => {
  await model.findByIdAndRemove(request.params.id).then((result) => {
    response.status(204).end();
  });
});

// Update item

router.put("/:id", async (request, response, next) => {
  const body = request.body;

  const item = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  await model
    .findByIdAndUpdate(request.params.id, item, { new: true })
    .then((updatedmodel) => {
      response.json(updatedmodel);
    });
});

// Create new item post
router.post("/", async (request, response) => {
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
  await item.save().then((savedmodel) => {
    response.json(savedmodel);
  });
});

module.exports = router;
