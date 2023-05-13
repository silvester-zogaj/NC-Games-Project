const express = require("express");
const app = express();
const {
  getCategories,
  getApi,
} = require("./controllers/categories.controller");
const {
  getReview,
  getReviews,
  getReviewComments,
  postReviewComment,
} = require("./controllers/reviews.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api", getApi);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postReviewComment);



app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid request" });
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
