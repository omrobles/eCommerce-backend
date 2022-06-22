const express = require("express");
const Book = require("../models/Book");
const router = express.Router();
const upload = require("../middlewares/storage");

router.get("/get-books", async (req, res) => {
  const { _id } = req.query;
  try {
    const books = _id ? await Book.find({ _id }) : await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({
      msg: "Error loading books from database",
    });
  }
});

router.get("/selected-books", async (req, res) => {
  try {
    const books = await Book.find({});
    const selectedBooks = books.slice(0, 3);
    res.json(selectedBooks);
  } catch (error) {
    res.status(500).json({
      msg: "Error loading books from database",
    });
  }
});

router.post("/add-book", upload.single("image"), async (req, res) => {
  const { title, autor, pages, description, price } = req.body;

  const tmpBook = Book({ title, autor, pages, description, price });
  if (req.file) {
    const { filename } = req.file;
    tmpBook.setImgUrl(filename);
  }

  const newBook = await Book.create({ tmpBook });
  res.json(newBook);
});

module.exports = router;
