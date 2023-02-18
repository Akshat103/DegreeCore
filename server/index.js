const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require('./config/db.config')

// Import Router
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const productRouter = require("./routes/products");
// Import Auth middleware for check user login or not~
const { loginCheck } = require("./middleware/auth");

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/product", productRouter);


// Run Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
