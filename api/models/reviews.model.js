const db = require("../../db/connection");

exports.selectReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      return result.rows[0];
    });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;

  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviewComments = (review_id) => {
  return db
    .query(
      `
  SELECT * FROM reviews WHERE review_id = $1`,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      } else {
        return db
          .query(
            ` SELECT comments.* FROM comments LEFT JOIN reviews ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        ORDER BY comments.created_at DESC`,
            [review_id]
          )
          .then((result) => {
            return result.rows;
          });
      }
    });
};

exports.updateReview = (review_id, newReview) => {
  if (typeof newReview.inc_votes !== 'number') {
    return Promise.reject({status: 403, msg: 'Invalid format'})
  }
  return db.query(
    `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;` , [newReview.inc_votes, review_id]
  ).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Review not found" });
    }
    return result.rows[0]
  });
};
