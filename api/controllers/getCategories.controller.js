const {
  selectCategories,
  selectApi,
} = require("../models/selectCategories.model");

exports.getCategories = (request, response) => {
  selectCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

// exports.getApi = (request, response) => {
//   selectApi().then((endpoints) => {
//     console.log(endpoints);
//     respond.status(200).send(endpoints);
//   });
// };
