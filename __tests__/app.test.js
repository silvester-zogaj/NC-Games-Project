const request = require("supertest");
const app = require("../api/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const jsonFileEndpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("/api/categories", () => {
  test("GET - status: 200 - responds with an array of category objects ", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const { categories } = response.body;
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(category.hasOwnProperty("slug")).toBe(true);
          expect(category.hasOwnProperty("description")).toBe(true);
        });
      });
  });

  describe("/api", () => {
    test("Get - status: 200 - responds with contents of endpoints.json file ", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const { endpoints } = response.body;
          expect(endpoints).toEqual(jsonFileEndpoints);
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  test("Get - status: 200 - responds with the first review ", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        // Arrange
        const { review } = response.body;
        // Assert
        expect(review.title).toBe("Agricola");
        expect(review.designer).toBe("Uwe Rosenberg");
        expect(review.owner).toBe("mallionaire");
        expect(review.review_img_url).toBe(
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(review.category).toBe("euro game");
        expect(review.created_at).toBe(
          JSON.parse(JSON.stringify(new Date(1610964020514)))
        );
        expect(review.votes).toBe(1);
        expect(typeof review.review_id).toEqual("number");
      });
  });
  test("Get - status: 404 - responds with review not found", () => {
    return request(app)
      .get("/api/reviews/300")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Review not found");
      });
  });
  test("Get - status: 400 - responds with invalid request", () => {
    return request(app)
      .get("/api/reviews/stuff")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Invalid request");
      });
  });
});

// describe('/api/reviews/:review_id/comments', () => {
//   test('Get - status: 200 - return an array of comments of the given review id', () => {
//     return request(app)
//     .get('/api/reviews/2/comments')
//     .expect(200)
//     .then ((response) => {
//         const {comments} = response.body

//         expect(comment.hasOwnProperty('comment_id')).toBe(true)
//         expect(comment.hasOwnProperty('votes')).toBe(true)
//         expect(comment.hasOwnProperty('created_at')).toBe(true)
//         expect(comment.hasOwnProperty('author')).toBe(true)
//         expect(comment.hasOwnProperty('body')).toBe(true)
//         expect(comment.hasOwnProperty('review_id')).toBe(true)
//     })
//   });
// });
