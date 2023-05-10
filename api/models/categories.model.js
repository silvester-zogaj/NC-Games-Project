const db = require("../../db/connection");
const fs = require('fs/promises');

exports.selectCategories = () => {
    
  return db
    .query(
      `
    SELECT * from categories
    `
    )
    .then((response) => {
        return response.rows
    });
}

