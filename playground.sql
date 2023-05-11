\c nc_games_test


SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(reviews.review_id) AS comment_count FROM reviews INNER JOIN comments ON reviews.review_id = comments.review_id
GROUP BY reviews.review_id
ORDER BY reviews.owner ASC;
