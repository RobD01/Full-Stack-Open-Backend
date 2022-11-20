const _ = require("lodash-contrib");

const dummy = (blogs) => {
  // ...
  return 1;
};

const totalLikes = (blogs) => {
  return blogs[0].likes;
};

const favoriteBlog = (blogs) => {
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > blogs[i + 1].likes) {
      console.log(blogs[i]);
      return blogs[i];
    } else {
      console.log(blogs[i + 1]);
      return blogs[i + 1];
    }
  }
};

const mostBlogs = (blogs) => {
  const authorList = [];

  blogs.forEach((element) => {
    authorList.push(element.author);
  });

  const author = _.frequencies(authorList);
  // const maxResult = Math.max(...array.map(o => o.y))

  console.log(author);
  return author;
};

const mostLikes = (blogs) => {
  const result = _(blogs)
    .groupBy("author")
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, "likes"),
    }))
    .value();

  const maxResult = _.maxBy(result, function (o) {
    return o.likes;
  });
  console.log(maxResult);
  return maxResult;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
