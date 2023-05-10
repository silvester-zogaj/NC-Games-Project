const { selectCategories, selectApi } = require("../models/categories.model");
const fs = require('fs/promises');

exports.getCategories = (request, response) => {
  selectCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (request, response) => {
    return fs
      .readFile(`endpoints.json`, "utf-8")
      .then((data) => {
        const parsedData = JSON.parse(data);
        return parsedData;
      })
      .then((endpoints) => {
        response.status(200).send({ endpoints });
      });
};
