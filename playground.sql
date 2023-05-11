\c nc_games_test


SELECT comments.* FROM comments INNER JOIN reviews ON comments.review_id = reviews.review_id;

