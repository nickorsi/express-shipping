"use strict";

const request = require("supertest");
const app = require("../app");

const fetchMock = require("fetch-mock");

const shipItAPI = require("../shipItApi")

// const shipItAPI.shipProduct


describe("POST /", function () {
  test("valid", async function () {
    // const resp = await request(app).post("/shipments").send({
    //   productId: 1000,
    //   name: "Test Tester",
    //   addr: "100 Test St",
    //   zip: "12345-6789",
    // });

    // expect(resp.body).toEqual({ shipped: expect.any(Number) });

    // Using fetchMock
    fetchMock.post(shipItAPI.SHIPIT_SHIP_URL, {
      body: {
        receipt: {
          shipId: "TESTING!"
        }
      },
      status: 200
    });

    const resp = await request(app).post("/shipments").send({
        productId: 1000,
        name: "Test Tester",
        addr: "100 Test St",
        zip: "12345-6789",
    });

    const result = await resp.body;

    expect(result).toEqual({"shipped": "TESTING!"});

    // Using Instrumented Function


  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test('returns error JSON if input invalid', async function() {

    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: 1000,
        name: 23455,
        addr: "100 Test St",
        zip: "12345-6789",
    });
    expect(resp.statusCode).toEqual(400)

  })
});
