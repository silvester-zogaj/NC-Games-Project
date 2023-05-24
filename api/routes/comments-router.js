const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/reviews.controller");

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
