const db = require("../../db/connection");

exports.selectReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({status: 404, msg: 'Review not found'});
      }
      return result.rows[0];
    });
};

exports.selectReviews = () => {
  return db.query(`SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(reviews.review_id) AS comment_count FROM reviews INNER JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;

  `).then((result) => {
    return result.rows
   })
}
