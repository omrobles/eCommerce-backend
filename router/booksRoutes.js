const express = require("express");
const Book = require("../models/Book");
const router = express.Router();

router.get("/get-books", async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({
      msg: "Error loading books from database",
    });
  }
});

router.post("/add-book", async (req, res) => {
  const { title, autor, pages, description, image, price } = req.body;
  const newBook = await Book.create({ title, autor, pages, description, image, price });
  res.json(newBook);
});

module.exports = router;
