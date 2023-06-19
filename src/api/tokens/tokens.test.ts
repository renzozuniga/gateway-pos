import request from "supertest";
import app from "../../app";
import { Tokens } from "./tokens.model";

beforeAll(async () => {
  try {
    await Tokens.drop;
  } catch (error) {}
});

let token = "";
describe("POST /api/v1/tokens", () => {
  it("responds with an error if the token is invalid", async () =>
    request(app)
      .post("/api/v1/tokens")
      .set("Accept", "application/json")
      .send({
        card_number: "TESTCARD",
      })
      .expect("Content-Type", /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty("issues");
      }));

  it("responds with an inserted object", async () =>
    request(app)
      .post("/api/v1/tokens")
      .set("Accept", "application/json")
      .send({
        card_number: 4111111111111,
        cvv: 123,
        expiration_month: "6",
        expiration_year: "2024",
        email: "test@gmail.com",
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty("token");
        token = response.body.token;
      }));
});

describe("GET /api/v1/tokens", () => {
  it("responds with a single token", async () =>
    request(app)
      .get(`/api/v1/tokens`)
      .set("Accept", "application/json")
      .set("Authorization", `${token}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("card_number");
        expect(response.body).not.toHaveProperty("cvv");
      }));
});
