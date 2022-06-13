const express = require("express");
const app = express();

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("eCommerce API");
});

app.listen(process.env.PORT, () => {
  console.log("The backend server is running");
});
