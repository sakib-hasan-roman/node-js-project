const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
//Created Dependencies ..........
const connectDB = require("./config/connectDB");
const User = require("./models/User");
const Todo = require("./models/Todo");
const Route = require("./routes/todos");
const errorHandler = require("./Middlewares/errorHandlers");
const UserRouter = require("./routes/users");

connectDB();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "images")));

//function for read data ......

// const createUSer = async () => {
//   const result = await User.create({
//     firstName: "Mahmudul",
//     lastName: "Hasan",
//     email: "Mahmudul@gmail.com",
//     age: 24,
//     gender: "male",
//   });
//   console.log(result);
// };

// createUSer();

app.use("/api/v1/todos", Route);
//User Api Handling Router
app.use("/api/v1/users", UserRouter);
app.use(errorHandler);
app.listen(3000);
