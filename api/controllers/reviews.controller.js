const {
  selectReview,
  selectReviews,
  selectReviewComments,
  updateReview, 
  createReviewComment,
  removeComment,
} = require("../models/reviews.model");


exports.getReview = (request, response, next) => {
  const { review_id } = request.params;
  selectReview(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (request, response, next) => {
  selectReviews()
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewComments = (request, response, next) => {
  const { review_id } = request.params;
  selectReviewComments(review_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};


exports.postReviewComment = (request, response, next) => {
  const { review_id } = request.params;
  createReviewComment(review_id, request.body)
  .then((comment) => {
    response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
    };

    
    
    exports.patchReview = (request, response, next) => {
      const {review_id} = request.params
      updateReview(review_id, request.body).then((review) => {
        response.status(200).send({review})
      })
      .catch ((err) => {
        next(err)
      })
    }

    
    exports.deleteComment = (request, response, next) => {
      const { comment_id } = request.params;
      removeComment(comment_id)
        .then(() => {
          // console.log(comment)
          response.status(204).send();
        })
        .catch((err) => {
          next(err);
        });
    };