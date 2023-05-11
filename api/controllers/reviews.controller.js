const {selectReview} = require('../models/reviews.model')

exports.getReview = (request, response, next) => {
    const {review_id} = request.params
    selectReview(review_id).then((review) => {
        response.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
}