const express = require("express");
const app = express();
const { getCategories , getApi} = require('./controllers/categories.controller')


app.get("/api/categories", getCategories);

app.get('/api', getApi)


app.use((err, request, response, next) => {
    response.status(500).send({msg: 'Server error!'})
});

module.exports = app;
