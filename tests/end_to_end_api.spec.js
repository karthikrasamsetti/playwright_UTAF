const { test, expect } = require('@playwright/test');
const bookingData = require("../data/bookingdetails.json");

const updatedData = require("../data/updatedBookingDetails.json");

const patchData = require("../data/patchdetails.json");

const statusCode = require("../data/statuscodes.json");
require("dotenv").config();

test("End-to-End Booking API Test", async ({ request }) => {
  let token, id;

  // Step 1: Get the token
  const authResponse = await request.post(`${process.env.apiBaseURL}/auth`, {
    data: {
      username: process.env.user,
      password: process.env.password,
    },
  });
  expect(authResponse.status()).toBe(statusCode.success);
  const authResponseBody = await authResponse.json();
  token = authResponseBody.token;
  console.log(`Token: ${token}`);

  // Step 2: Get all booking IDs
  const getAllBookingsResponse = await request.get(`${process.env.apiBaseURL}/booking`);
  expect(getAllBookingsResponse.status()).toBe(statusCode.success);
  const allBookings = await getAllBookingsResponse.json();
  console.log(`All Bookings: ${JSON.stringify(allBookings)}`);
  expect(getAllBookingsResponse.ok()).toBeTruthy();

  // Step 3: Post booking details
  const postBookingResponse = await request.post(`${process.env.apiBaseURL}/booking`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: bookingData,
  });
  expect(postBookingResponse.status()).toBe(statusCode.success);
  expect(postBookingResponse.ok()).toBeTruthy();
  const postBookingResponseBody = await postBookingResponse.json();
  id = postBookingResponseBody.bookingid;
  console.log(`Booking ID: ${id}`);
  
  expect(postBookingResponseBody.booking).toHaveProperty("firstname", bookingData.firstname);
  expect(postBookingResponseBody.booking).toHaveProperty("lastname", bookingData.lastname);
  expect(postBookingResponseBody.booking).toHaveProperty("totalprice", bookingData.totalprice);
  expect(postBookingResponseBody.booking).toHaveProperty("depositpaid", bookingData.depositpaid);

  // Step 4: Get details of the booking based on ID
  const getBookingByIdResponse = await request.get(`${process.env.apiBaseURL}/booking/${id}`, {
    headers: { 
      'Accept': 'application/json'
    },
  });
  expect(getBookingByIdResponse.status()).toBe(statusCode.success);
  expect(getBookingByIdResponse.ok()).toBeTruthy();
  const getBookingByIdResponseBody = await getBookingByIdResponse.json();
  console.log(`Booking Details: ${JSON.stringify(getBookingByIdResponseBody)}`);

  // Step 5: Update booking details
  const updateBookingResponse = await request.put(`${process.env.apiBaseURL}/booking/${id}`, {
    headers: {
      Cookie: `token=${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: updatedData,
  });
  expect(updateBookingResponse.ok()).toBeTruthy();
  expect(updateBookingResponse.status()).toBe(statusCode.success);
  const updateBookingResponseBody = await updateBookingResponse.json();
  expect(updateBookingResponseBody).toHaveProperty("firstname", updatedData.firstname);
  expect(updateBookingResponseBody).toHaveProperty("lastname", updatedData.lastname);

  // Step 6: Update particular fields in booking details
  const patchBookingResponse = await request.patch(`${process.env.apiBaseURL}/booking/${id}`, {
    headers: {
      Cookie: `token=${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: patchData,
  });
  expect(patchBookingResponse.ok()).toBeTruthy();
  expect(patchBookingResponse.status()).toBe(statusCode.success);
  const patchBookingResponseBody = await patchBookingResponse.json();
  console.log(`Updated Booking: ${JSON.stringify(patchBookingResponseBody)}`);
  expect(patchBookingResponseBody).toHaveProperty("firstname", patchData.firstname);
  expect(patchBookingResponseBody).toHaveProperty("lastname", patchData.lastname);

  // Step 7: Delete the booking details
  const deleteBookingResponse = await request.delete(`${process.env.apiBaseURL}/booking/${id}`, {
    headers: {
      Cookie: `token=${token}`,
      'Content-Type': 'application/json'
    },
  });
  expect(deleteBookingResponse.status()).toBe(statusCode.created);
});
