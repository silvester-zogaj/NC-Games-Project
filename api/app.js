const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const categoriesRouter = require("./routes/categories-router");
const reviewsRouter = require("./routes/reviews-router");
const usersRouter = require("./routes/users-router");
const commentsRouter = require("./routes/comments-router");


app.use(express.json());

app.use("/api", apiRouter);

app.use("/api/categories", categoriesRouter);

app.use("/api/reviews", reviewsRouter);

app.use("/api/users", usersRouter);

app.use("/api/comments", commentsRouter);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "23503") {
    response.status(404).send({ msg: "Username not found" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Server error!" });
});

module.exports = app;
