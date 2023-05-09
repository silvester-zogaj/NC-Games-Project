const express = require("express");
const app = express();
const { getCategories } = require("./controllers/getCategories.controller");

app.get("/api/categories", getCategories);


app.use((err, request, response, next) => {
    console.log(err);
});

module.exports = app;
