const express = require("express");
const app = express();
const { getCategories , getApi} = require('./controllers/categories.controller')
const {getReview} = require('./controllers/reviews.controller')

app.use(express.json());

app.get("/api/categories", getCategories);

app.get('/api', getApi)

app.get('/api/reviews/:review_id', getReview)


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
