const { test, expect } = require("@playwright/test");

const bookingData = require("../data/bookingdetails.json");

const updatedData = require("../data/updatedBookingDetails.json");

const patchData = require("../data/patchdetails.json");

const statusCode = require("../data/statuscodes.json");
const schema = require("../data/schema.json");
require("dotenv").config();
const Ajv = require("ajv");
var token;

var id;
test.describe.configure({ mode: 'serial' });
// Test case to get the authentication token
test("get the token", async ({ request }) => {
  const response = await request.post(`${process.env.apiBaseURL}/auth`, {
    data: {
      username: process.env.user,

      password: process.env.password,
    },
  });

  const responseBody = await response.json();

  token = await responseBody.token;

  console.log(await token);

  expect(response.status()).toBe(statusCode.success);
});

// Test case to get all booking IDs
test("Getting all the booking ids", async ({ request }) => {
  const response = await request.get(`${process.env.apiBaseURL}/booking`);

  const responseBody = await response.json();

  console.log(responseBody);

  expect(response.status()).toBe(statusCode.success);

  expect(response.ok()).toBeTruthy();
});

// Test case to post booking details
test("Posting the booking details", async ({ request }) => {
  const response = await request.post(`${process.env.apiBaseURL}/booking`, {
    headers: { 'Content-Type': 'application/json',
    'Accept':'application/json' },
    data: bookingData,
  });

  expect(response.status()).toBe(statusCode.success);

  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();

  console.log(responseBody.bookingid);

  id = responseBody.bookingid;

  expect(responseBody.booking).toHaveProperty(
    "firstname",
    bookingData.firstname
  );

  expect(responseBody.booking).toHaveProperty("lastname", bookingData.lastname);

  expect(responseBody.booking).toHaveProperty(
    "totalprice",

    bookingData.totalprice
  );

  expect(responseBody.booking).toHaveProperty(
    "depositpaid",

    bookingData.depositpaid
  );
});

// Test case to get details of a user based on ID
test("Getting details of an user based on id", async ({ request }) => {
  const response = await request.get(`${process.env.apiBaseURL}/booking/${id}`,
  {
    headers: { 
    'Accept':'application/json' },
  });

  const responseBody = await response.json();

  console.log(responseBody);

  expect(response.status()).toBe(statusCode.success);

  expect(response.ok()).toBeTruthy();
});
// validate schema
test("Validate the schema", async ({ request }) => {
  const response = await request.get(`${process.env.apiBaseURL}/booking/${id}`);
  const responseBody = await response.json();
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValid = validate(responseBody);
  expect(isValid).toBe(true);
});

// Test case to update booking details
test("Update the booking details", async ({ request }) => {
  const response = await request.put(
    `${process.env.apiBaseURL}/booking/${id}`,
    {
      headers: { Cookie: `token=${token}` ,
      'Content-Type': 'application/json',
      'Accept':'application/json'
    },

      data: updatedData,
    }
  );

  expect(response.ok()).toBeTruthy();

  expect(response.status()).toBe(statusCode.success);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty("firstname", updatedData.firstname);

  expect(responseBody).toHaveProperty("lastname", updatedData.lastname);
});

// Test case to update particular fields in booking details
test("Update the paticular fields in booking details", async ({ request }) => {
  const response = await request.patch(
    `${process.env.apiBaseURL}/booking/${id}`,
    {
      headers: { Cookie: `token=${token}`,
      'Content-Type': 'application/json',
      'Accept':'application/json'
    },

      data: patchData,
    }
  );

  console.log(await response.json());

  expect(response.ok()).toBeTruthy();

  expect(response.status()).toBe(statusCode.success);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty("firstname", patchData.firstname);

  expect(responseBody).toHaveProperty("lastname", patchData.lastname);
});

// Test case to delete the booking details
test("Delete the booking details", async ({ request }) => {
  const response = await request.delete(
    `${process.env.apiBaseURL}/booking/${id}`,
    {
      headers: { Cookie: `token=${token}`,
      'Content-Type': 'application/json', },
    }
  );

  expect(response.status()).toBe(statusCode.created);
});
