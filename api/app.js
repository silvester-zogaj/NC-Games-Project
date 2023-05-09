const express = require("express");
const app = express();
const { getCategories } = require("./controllers/getCategories.controller");

app.get("/api/categories", getCategories);


app.use((err, request, response, next) => {
    response.status(500).send({msg: 'Server error!'})
});

module.exports = app;
