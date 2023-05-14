const request = require("supertest");
const app = require("../api/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const jsonFileEndpoints = require("../endpoints.json");
const jestSorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("/api/categories", () => {
  test("GET - status: 200 - responds with an array of category objects", () => {
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

describe("/api/reviews", () => {
  test("GET - status: 200 - responds with an array of category objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const { reviews } = response.body;
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
          expect(review.hasOwnProperty("owner")).toBe(true);
          expect(review.hasOwnProperty("title")).toBe(true);
          expect(review.hasOwnProperty("review_id")).toBe(true);
          expect(review.hasOwnProperty("category")).toBe(true);
          expect(review.hasOwnProperty("review_img_url")).toBe(true);
          expect(review.hasOwnProperty("created_at")).toBe(true);
          expect(review.hasOwnProperty("votes")).toBe(true);
          expect(review.hasOwnProperty("designer")).toBe(true);
          expect(review.hasOwnProperty("comment_count")).toBe(true);
          expect(review.hasOwnProperty("review_body")).toBe(false);

          expect(typeof review.owner).toBe("string");
          expect(typeof review.title).toBe("string");
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.category).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
          expect(typeof review.comment_count).toBe("string");
        });
      });
  });
  test("GET - status: 200 - responds with an array of category objects sorted in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const { reviews } = response.body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("Get - status: 200 - return an array of comments of the given review id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments.length).toBe(3);
        comments.forEach((comment) => {
          expect(comment.hasOwnProperty("comment_id")).toBe(true);
          expect(comment.hasOwnProperty("votes")).toBe(true);
          expect(comment.hasOwnProperty("created_at")).toBe(true);
          expect(comment.hasOwnProperty("author")).toBe(true);
          expect(comment.hasOwnProperty("body")).toBe(true);
          expect(comment.review_id).toBe(2);

          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.review_id).toBe("number");
        });
      });
  });
  test("GET - status: 200 - responds with an array of category objects sorted in descending order", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET - status: 200 - responds with an empty array if review id exists but no comments are found", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toEqual([]);
      });
  });
  test("Get - status: 404 - responds with review not found", () => {
    return request(app)
      .get("/api/reviews/20/comments")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Review not found");
      });
  });
  test("Get - status: 400 - responds with invalid request", () => {
    return request(app)
      .get("/api/reviews/stuff/comments")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Invalid request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test.only("Delete - status: 204 - responds with no content", () => {
    return request(app)
      .delete("/api/comments/6")
      .expect(204)
      .then((response) => {
        console.log(response.body.result)
        expect(response.body).toEqual({});
      });
  });
  test("Delete - status: 404 - responds with comment not found", () => {
    return request(app)
      .delete("/api/comments/30")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe('Comment not found');
      });
  });
});
