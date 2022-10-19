const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongod");
const userRouter = require("./routes/usersRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);

// Error Handaling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});
module.exports = app;
