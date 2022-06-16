const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const Book = require("./models/Book");
const connectDB = require("./config/db");

require("dotenv").config();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

connectDB();

app.use("/book", require("./router/booksRoutes"));
app.get("/", (req, res) => {
  res.send("eCommerce API");
});

app.listen(process.env.PORT, () => {
  console.log("The backend server is running");
});
