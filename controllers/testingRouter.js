const testingRouter = require("express").Router();
const blog = require("../models/blog");
const User = require("../models/user");

testingRouter.post("/reset", async (request, response) => {
  await blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

testingRouter.get("/reset", async (request, response) => {
  response.json("yes");
});

module.exports = testingRouter;
