const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    autor: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgurl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.methods.setImgUrl = function setImgUrl(filename) {
  return (this.imgurl = `${process.env.HOST}:${process.env.PORT}/public/${filename}`);
};

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
