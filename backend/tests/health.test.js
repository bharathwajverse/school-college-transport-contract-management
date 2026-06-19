const request = require("supertest");

// Mock the database pool to avoid actual connection attempts during tests
jest.mock("../src/config/db", () => ({
  pool: {
    query: jest.fn(),
    on: jest.fn(),
  },
  query: jest.fn(),
  withTransaction: jest.fn(),
}));

const app = require("../src/app");

describe("GET /health", () => {
  it("should return 200 and success status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "API is healthy",
    });
  });
});
