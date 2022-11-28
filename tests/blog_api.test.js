// npm run test

const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const Item = require("../models/blog");

const api = supertest(app);

const { initialItem, nonExistingId, itemsInDb } = helper;

beforeEach(async () => {
  await Item.deleteMany({});
  console.log("cleared");

  for (let item of initialItem) {
    let itemObject = new Item(item);
    await itemObject.save();
  }
});

// Get request

describe("get items", () => {
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

  test("a specific item can be viewed", async () => {
    const itemsAtStart = await itemsInDb();

    const itemToView = itemsAtStart[0];

    const resultItem = await api
      .get(`/api/blog/${itemToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedItemToView = JSON.parse(JSON.stringify(itemToView));

    expect(resultItem.body).toEqual(processedItemToView);
  });
});

// Post request

describe("post items", () => {
  test("a valid blog can be added", async () => {
    const newItem = {
      title: "Friendship",
      author: "Reigan",
      url: "abc.com",
      likes: 33,
      id: "ssss",
    };

    await api
      .post("/api/blog")
      .send(newItem)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const itemsAtEnd = await itemsInDb();
    expect(itemsAtEnd).toHaveLength(initialItem.length + 1);

    const title = itemsAtEnd.map((n) => n.title);
    expect(title).toContain("Friendship");
  });

  test("blog without content is not added", async () => {
    const newItem = {};

    console.log(initialItem);

    await api.post("/api/blog").send(newNote).expect(400);

    const response = await api.get("/api/blog");

    expect(response.body).toHaveLength(initialItem.length);
  });
});

// Delete request

describe("delete item", () => {
  test.only("a item can be deleted", async () => {
    const itemsAtStart = await itemsInDb();
    const itemToDelete = itemsAtStart[0];

    await api.delete(`/api/blog/${itemToDelete.id}`).expect(204);

    const itemsAtEnd = await itemsInDb();

    expect(itemsAtEnd).toHaveLength(initialItem.length - 1);

    const title = itemsAtEnd.map((r) => r.title);

    expect(title).not.toContain(itemToDelete.title);
  });
  test("succeeds with status code 204 if id is valid", async () => {
    const itemsAtStart = await itemsInDb();
    const itemToDelete = itemsAtStart[0];

    await api.delete(`/api/blog/${itemToDelete.id}`).expect(204);

    const itemsAtEnd = await itemsInDb();

    expect(itemsAtEnd).toHaveLength(initialItem.length - 1);

    const title = itemsAtEnd.map((r) => r.title);

    expect(title).not.toContain(itemToDelete.title);
  });
});

test("unique identifier is named id", async () => {
  const itemsAtStart = await itemsInDb();

  expect(itemsAtStart[0]).toHaveProperty("id");
});

test("likes property missing , default to 0", async () => {
  const newItem = {
    title: "Friendship",
    author: "Reigan",
    url: "abc.com",

    id: "ssss",
  };

  await api
    .post("/api/blog")
    .send(newItem)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const itemsAtEnd = await itemsInDb();
  expect(itemsAtEnd).toHaveLength(initialItem.length + 1);

  const lastItem = itemsAtEnd[itemsAtEnd.length - 1];
  expect(lastItem).toHaveProperty("likes", 0);
});

// Put request
test("a valid blog can be updated", async () => {
  const newItem = {
    title: "Friendship",
    author: "Reigan",
    url: "abc.com",
    likes: 33,
    id: "ssss",
  };

  const itemsAtStart = await itemsInDb();
  const itemToUpdate = itemsAtStart[0];

  await api
    .put(`/api/blog/${itemToUpdate.id}`)
    .send(newItem)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const itemsAtEnd = await itemsInDb();
  expect(itemsAtEnd[0].title).toEqual("Friendship");
});

afterAll(() => {
  mongoose.connection.close();
});

// npm run test
