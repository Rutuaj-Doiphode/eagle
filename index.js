const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config({ path: "./.env" });
const port = process.env.PORT;

// const User = require('./Model/userSchema');
app.use(cookieParser());
app.use(express.json());
app.use(require("./routes/monitorRoute"));

app.get("/", function (req, res) {
  res.send("Hello Eagles....");
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
