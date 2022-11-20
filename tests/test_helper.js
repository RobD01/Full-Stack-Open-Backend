const Item = require("../models/model");

const initialItem = [
  {
    title: "Prophecy",
    author: "Genos",
    url: "abc.com",
    likes: 30,
    id: "637724f6338a70eb506f01a7",
  },
  {
    title: "Future",
    author: "Dimple",
    url: "abc.com",
    likes: 12,
    id: "aaaa",
  },
];

const nonExistingId = async () => {
  const note = new Item({
    title: "Dragonball",
    author: "Akira",
    url: "abc.com",
    likes: 30,
  });
  await note.save();
  await note.remove();

  return note._id.toString();
};

const itemsInDb = async () => {
  const items = await Item.find({});
  return items.map((item) => item.toJSON());
};

module.exports = {
  initialItem,
  nonExistingId,
  itemsInDb,
};
