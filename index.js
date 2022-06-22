const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");

require("dotenv").config();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

connectDB();

app.use("/public", express.static(`${__dirname}/storage/imgs`));
app.use("/book", require("./router/booksRoutes"));
app.use("/users", require("./router/userRoutes"));
app.get("/", (req, res) => {
  res.send("eCommerce API");
});

app.listen(process.env.PORT, () => {
  console.log("The backend server is running");
});
