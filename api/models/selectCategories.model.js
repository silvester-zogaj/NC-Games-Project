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

// exports.selectApi = () => {
//         return fs.readFile(`endpoints.json`, 'utf-8')
//             .then((data) => {
//                 // const parsedData = JSON.parse(data);
//                 return data;
//             })
// }
