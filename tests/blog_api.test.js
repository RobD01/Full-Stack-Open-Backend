const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const Item = require("../models/model");

const api = supertest(app);

const { initialItem, nonExistingId, itemsInDb } = helper;

beforeEach(async () => {
  await Item.deleteMany({});
  let noteObject = new Item(initialItem[0]);
  await noteObject.save();
  noteObject = new Item(initialItem[1]);
  await noteObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blog")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blog are returned", async () => {
  const response = await api.get("/api/blog");

  expect(response.body).toHaveLength(initialItem.length);
});

test("a specific note is within the returned blog", async () => {
  const response = await api.get("/api/blog");

  const contents = response.body.map((r) => r.title);
  expect(contents).toContain("Future");
});

test("a valid blog can be added", async () => {
  const newNote = {
    title: "Friendship",
    author: "Reigan",
    url: "abc.com",
    likes: 33,
    id: "ssss",
  };

  await api
    .post("/api/blog")
    .send(newNote)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const itemsAtEnd = await itemsInDb();
  expect(itemsAtEnd).toHaveLength(initialItem.length + 1);

  const title = itemsAtEnd.map((n) => n.title);
  expect(title).toContain("Future");
});

test("blog without content is not added", async () => {
  const newNote = {};

  console.log(initialItem);

  await api.post("/api/blog").send(newNote).expect(400);

  const response = await api.get("/api/blog");

  expect(response.body).toHaveLength(initialItem.length);
});

test.only("a specific item can be viewed", async () => {
  const itemsAtStart = await itemsInDb();

  const itemToView = itemsAtStart[0];

  const resultItem = await api
    .get(`/api/blog/${itemToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const processedItemToView = JSON.parse(JSON.stringify(itemToView));

  expect(resultItem.body).toEqual(processedItemToView);
});

test.only("a item can be deleted", async () => {
  const itemsAtStart = await itemsInDb();
  const itemToDelete = itemsAtStart[0];

  await api.delete(`/api/blog/${itemToDelete.id}`).expect(204);

  const itemsAtEnd = await itemsInDb();

  expect(itemsAtEnd).toHaveLength(initialItem.length - 1);

  const title = itemsAtEnd.map((r) => r.title);

  expect(title).not.toContain(itemToDelete.title);
});

afterAll(() => {
  mongoose.connection.close();
});
