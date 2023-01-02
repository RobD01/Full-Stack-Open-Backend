const blogRouter = require("express").Router();
const blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { getTokenFrom } = require("../utils/middleware");

// Check item model in line 46 , 71

// CRUD

// Get item
blogRouter.get("/", async (request, response) => {
  const blogs = await blog
    .find({})
    .populate("userId", { username: 1, name: 1 });

  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  await blog.findById(request.params.id).then((item) => {
    if (item) {
      response.json(item);
    } else {
      response.status(404).end();
    }
  });
});

// Delete item

blogRouter.delete("/:id", async (request, response) => {
  // Authorize user
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blogItem = await blog.findById(request.params.id);

  console.log(blogItem.userId.valueOf(), user._id.valueOf());

  // // Action only if authorized
  if (blogItem.userId.valueOf() !== user._id.valueOf()) {
    console.log("Delete error: invalid token authorizaiton");
  } else {
    await blog.findByIdAndRemove(request.params.id).then(() => {
      response.status(204).end();
    });
  }
});

// Update item

blogRouter.put("/:id", async (request, response) => {
  // Authorize user
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blogItem = await blog.findById(request.params.id);

  console.log(blogItem.userId.valueOf(), user._id.valueOf());

  const body = request.body;

  const item = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  };

  // // Action only if authorized
  if (blogItem.userId.valueOf() !== user._id.valueOf()) {
    console.log("Delete error: invalid token authorizaiton");
  } else {
    await blog
      .findByIdAndUpdate(request.params.id, item, { new: true })
      .then((updatedblog) => {
        response.json(updatedblog);
      });
  }
});

// Create new item post
blogRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!body.title || !body.author || !body.url) {
    return response.status(400).json({
      error: "Info missing",
    });
  }

  const item = new blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    userId: user.id,
  });

  // Save into MongoDB

  const savedBlog = await item.save();
  user.blog = user.blog.concat(savedBlog.id);
  await user.save();

  response.json(savedBlog);
});

module.exports = blogRouter;
