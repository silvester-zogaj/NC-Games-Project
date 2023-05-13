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

exports.createReviewComment = (review_id, newComment) => {
  const { username, body } = newComment;
  if(body === '') {
    return Promise.reject({status: 404, msg: 'Missing comment'})
  }
  if (!username || !body) {
    return Promise.reject({ status: 404, msg: "Invalid properties" });
  }

  console.log(body)
  return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id]).then(
    (result) => {
      
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      return db
        .query(
          `INSERT INTO comments 
       (review_id, author, body)
        VALUES 
        ($1, $2, $3)
        returning *;
  `,
          [review_id, username, body]
        )
        .then((result) => {
          return result.rows[0];
        });
    }
  );
};
