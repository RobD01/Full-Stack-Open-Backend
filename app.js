const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blog");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const phonebookRouter = require("./controllers/phonebook");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
require("express-async-errors");

// Check api url in line 28

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blog", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/persons", phonebookRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.getTokenFrom);
app.use(middleware.userExtractor);
app.use(middleware.errorHandler);

module.exports = app;
