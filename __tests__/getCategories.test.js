const request = require("supertest");
const app = require('../api/app')
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET - getCategories", () => {
  test("should return an array of category objects ", () => {
    return request(app)
    .get("/api/categories")
    .expect(200)
    .then((response)=> {
        const {categories} = response.body
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
            expect(category.hasOwnProperty('slug')).toBe(true)
            expect(category.hasOwnProperty('description')).toBe(true)
        })
    })
  });


});
