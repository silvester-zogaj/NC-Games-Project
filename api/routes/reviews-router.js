const reviewsRouter = require("express").Router();
const {
  getReview,
  getReviews,
  getReviewComments,
  postReviewComment,
  patchReview,
} = require("../controllers/reviews.controller");

reviewsRouter.get("/", getReviews);

reviewsRouter.get("/:review_id", getReview);

reviewsRouter.get("/:review_id/comments", getReviewComments);

reviewsRouter.post("/:review_id/comments", postReviewComment);

reviewsRouter.patch("/:review_id", patchReview);

module.exports = reviewsRouter;
