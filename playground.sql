\c nc_games_test


 SELECT * FROM comments LEFT JOIN reviews ON comments.review_id = reviews.review_id
ORDER BY comments.created_at DESC

