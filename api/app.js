const express = require("express");
const app = express();
const { getCategories, getApi } = require("./controllers/getCategories.controller");
const fs = require('fs/promises');


app.get("/api/categories", getCategories);


app.get('/api', (request, response) => {
    fs.readFile(`endpoints.json`, 'utf-8').then((data) => {
        const parsedData = JSON.parse(data);
        response.status(200).send({ endpoints: parsedData });
    });
});


app.use((err, request, response, next) => {
    response.status(500).send({msg: 'Server error!'})
});

module.exports = app;
