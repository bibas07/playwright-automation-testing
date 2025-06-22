// api.test.js

import test, { expect } from "playwright/test";
import { ApiHelper } from "../helpers/booksApi.helper";

function generateRandomISBN() {
  const prefix = "978";
  const group = Math.floor(Math.random() * 10); // 0-9
  const publisher = Math.floor(Math.random() * 90 + 10); // 10-99 (2 digits)
  const title = Math.floor(Math.random() * 9000000 + 1000000); // 7 digits
  const checkDigit = Math.floor(Math.random() * 10); // 0-9

  return `${prefix}-${group}-${publisher}-${title}-${checkDigit}`;
}

function generateRandomUserId() {
  return Math.floor(Math.random() * 10000000);
}

const api = new ApiHelper();
const newBook = {
  userId: generateRandomUserId(),
  collectionOfIsbns: [{ isbn: generateRandomISBN() }],
};
const isbn = "978-1-23-456789-0";

test("GET all books should return list of books", async () => {
  const { status, body } = await api.getAllBooks();
  expect(status).toBe(200);
  expect(Array.isArray(body.books)).toBe(true);
  expect(body.books.length).toBeGreaterThan(0);
});

test("POST a new book to user collection should succeed", async () => {
  const { status } = await api.addBook(
    newBook.userId,
    newBook.collectionOfIsbns
  );
  expect(status).toContain(201);
});

test("PUT to update a book should succeed or fail gracefully", async () => {
  const { status } = await api.updateBook(
    newBook.collectionOfIsbns,
    "Updated Book Title",
    "Updated Author"
  );
  expect([200, 404, 400]).toContain(status);
});

test("DELETE a book should succeed or be already deleted", async () => {
  const { status } = await api.deleteBook(newBook.collectionOfIsbns);
  expect([200, 204, 404]).toContain(status);
});

test("GET specific book by ISBN should return result or not found", async () => {
  const { status, body } = await api.getBookByISBN(isbn);
  if (status === 200) {
    expect(body.isbn).toBe(isbn);
  } else {
    expect([400, 404]).toContain(status);
  }
});

test("POST with missing ISBN should return 400", async () => {
  const { status } = await api.addBook(newBook.userId, []);
  expect(status).toBe(400);
});
