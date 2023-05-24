const apiRouter = require("express").Router();
const {
  getApi
} = require("../controllers/categories.controller");

apiRouter.get("/", getApi);

module.exports = apiRouter;
