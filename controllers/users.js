const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Create Item
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
  console.log(user.token);
});

// Get item

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blog", { title: 1, author: 1 });

  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  await User.findById(request.params.id).then((item) => {
    if (item) {
      response.json(item);
    } else {
      response.status(404).end();
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    console.log(decodedToken.id);
  });
});

// Delete item

usersRouter.delete("/:id", async (request, response) => {
  await User.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end();
  });
});

// Update item

usersRouter.put("/:id", async (request, response) => {
  const { username, name, password } = request.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  await User.findByIdAndUpdate(request.params.id, user, { new: true }).then(
    (updatedblog) => {
      response.json(updatedblog);
    }
  );
});

module.exports = usersRouter;
