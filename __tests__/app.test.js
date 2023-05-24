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
  describe("GET /api", () => {
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
  });
});
describe("/api", () => {
  describe("GET /api", () => {
    test("GET - status: 200 - responds with contents of endpoints.json file ", () => {
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
  describe("GET /api", () => {
    test("GET - status: 200 - responds with the first review ", () => {
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
    test("GET - status: 404 - responds with review not found", () => {
      return request(app)
        .get("/api/reviews/300")
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Review not found");
        });
    });
    test("GET - status: 400 - responds with invalid request", () => {
      return request(app)
        .get("/api/reviews/stuff")
        .expect(400)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Invalid request");
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET /api", () => {
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
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET /api", () => {
    test("GET - status: 200 - return an array of comments of the given review id", () => {
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
    test("GET - status: 404 - responds with review not found", () => {
      return request(app)
        .get("/api/reviews/20/comments")
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Review not found");
        });
    });
    test("GET - status: 400 - responds with invalid request", () => {
      return request(app)
        .get("/api/reviews/stuff/comments")
        .expect(400)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Invalid request");
        });
    });
  });
  describe("POST /api", () => {
    test("POST - status: 201 - responds with the posted comment", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "mallionaire", body: "Really great!" })
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toEqual({
            author: "mallionaire",
            body: "Really great!",
            comment_id: 7,
            created_at: expect.any(String),
            review_id: 1,
            votes: 0,
          });
        });
    });
    test("POST - status: 400 - responds with review not found", () => {
      return request(app)
        .post("/api/reviews/50/comments")
        .send({ username: "mallionaire", body: "Really great!" })
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Review not found");
        });
    });
    test("POST - status: 404 - responds with Username does not exist", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "pepperoni", body: "Really great!" })
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Username not found");
        });
    });
    test("POST - status: 404 - responds with invalid properties", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ random: "mallionaire", thing: "Really great!" })
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Invalid properties");
        });
    });
    test("POST - status: 400 - responds with invalid request", () => {
      return request(app)
        .post("/api/reviews/stuff/comments")
        .send({ username: "mallionaire", body: "Really great!" })
        .expect(400)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Invalid request");
        });
    });
    test("POST - status: 404 - responds with missing comment", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "mallionaire", body: "" })
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Missing comment");
        });
    });
  });
});

describe("/api/reviews/:review_id/", () => {
  describe("PATCH /api", () => {
    test("PATCH - status: 200 - respond with updated review (incremented votes)", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: 10 })
        .expect(200)
        .then((response) => {
          const { review } = response.body;
          expect(review).toEqual({
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
            review_body: "We couldn't find the werewolf!",
            category: "social deduction",
            created_at: JSON.parse(JSON.stringify(new Date(1610964101251))),
            votes: 15,
            review_id: 3,
          });
        });
    });
    test("PATCH - status: 200 - respond with updated review (decremented votes)", () => {
      return request(app)
        .patch("/api/reviews/12")
        .send({ inc_votes: -50 })
        .expect(200)
        .then((response) => {
          const { review } = response.body;
          expect(review).toEqual({
            title: "Scythe; you're gonna need a bigger table!",
            designer: "Jamey Stegmaier",
            owner: "mallionaire",
            review_img_url:
              "https://images.pexels.com/photos/4200740/pexels-photo-4200740.jpeg?w=700&h=700",
            review_body:
              "Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.",
            category: "social deduction",
            created_at: JSON.parse(JSON.stringify(new Date(1611311824839))),
            votes: 50,
            review_id: 12,
          });
        });
    });
    test("PATCH - status: 404 - responds with review not found", () => {
      return request(app)
        .patch("/api/reviews/25")
        .send({ inc_votes: 10 })
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Review not found");
        });
    });
    test("PATCH - status: 400 - responds with invalid request", () => {
      return request(app)
        .patch("/api/reviews/morestuff")
        .send({ inc_votes: 10 })
        .expect(400)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Invalid request");
        });
    });
    test("PATCH - status: 400 - responds with invalid format (property value)", () => {
      return request(app)
        .patch("/api/reviews/5")
        .send({ inc_votes: "evenmorestuff" })
        .expect(403)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Invalid format");
        });
    });
    test("PATCH - status: 400 - responds with invalid request (property key)", () => {
      return request(app)
        .patch("/api/reviews/5")
        .send({ inc_vo: 25 })
        .expect(403)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Invalid format");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE /api", () => {
    test("DELETE - status: 204 - responds with no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });
    test("DELETE - status: 404 - responds with comment not found", () => {
      return request(app)
        .delete("/api/comments/10")
        .expect(404)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Comment not found");
        });
    });
    test("DELETE - status: 400 - responds with invalid request", () => {
      return request(app)
        .delete("/api/comments/things")
        .expect(400)
        .then((response) => {
          const { msg } = response.body;
          expect(msg).toBe("Invalid request");
        });
    });
  });
});
