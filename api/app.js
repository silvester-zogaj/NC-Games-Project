const express = require("express");
const app = express();
const { getCategories , getApi} = require('./controllers/categories.controller')
const {getReview, getReviewComments} = require('./controllers/reviews.controller')

app.use(express.json());

app.get("/api/categories", getCategories);

app.get('/api', getApi)

app.get('/api/reviews/:review_id', getReview)

app.get('/api/reviews/:review_id/comments', getReviewComments )


app.use((err, request, response, next) => {
    if (err.code === '22P02') {
      response.status(400).send({ msg: 'Invalid request' });
    } else {
        next(err);
    }
  });

app.use((err,request, response, next) => {
    if(err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, request, response, next) => {
    response.status(500).send({msg: 'Server error!'})
});

module.exports = app;
