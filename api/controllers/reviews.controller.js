const { selectReview, selectReviews, selectReviewComments, updateReview} = require("../models/reviews.model");

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


  
  exports.getReviewComments = (request, response, next ) => {
    const {review_id} = request.params;
    selectReviewComments(review_id).then((comments) => {
      response.status(200).send({comments})
    })
    .catch((err) => {
      next(err)
    })
    
  }

  exports.patchReview = (request, response, next) => {
    const {review_id} = request.params
    updateReview(review_id, request.body).then((review) => {
      response.status(200).send({review})
    })
  }