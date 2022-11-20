const listHelper = require("../utils/listhelper");

test("dummy returns one", () => {
  const blogs = [2];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe("Most likes, author with most blogs", () => {
  const blogList = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5655",
      title: "Favorite blog",
      author: "Pika",
      url: "abc.com",
      likes: 10,
      __v: 0,
    },
    {
      _id: "44222",
      title: "another blog",
      author: "Raichu",
      url: "abc.com",
      likes: 15,
      __v: 0,
    },
    {
      _id: "22222",
      title: "Pika pika",
      author: "Pika",
      url: "abc.com",
      likes: 10,
      __v: 0,
    },
    {
      _id: "33333",
      title: "Pika 11111",
      author: "Pika",
      url: "abc.com",
      likes: 10,
      __v: 0,
    },
  ];

  test("return the blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogList);
    expect(JSON.stringify(result)).toBe(
      JSON.stringify({
        _id: "5655",
        title: "Favorite blog",
        author: "Pika",
        url: "abc.com",
        likes: 10,
        __v: 0,
      })
    );
  });

  test.only("return the author with most blogs", () => {
    const result = listHelper.mostBlogs(blogList);
    expect(result).toBe("Pika");
  });

  test("return the author with most like", () => {
    const result = listHelper.mostLikes(blogList);
    expect(JSON.stringify(result)).toBe(
      JSON.stringify({ author: "Pika", likes: 30 })
    );
  });
});
