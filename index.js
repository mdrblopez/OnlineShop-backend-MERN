// To run: nodemon index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/post");
const Cart = require("./models/cart");
const app = express();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs"); //file system to rename the file

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
// app.use(express.static("uploads")); // to display the picture from uploads folder

app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  "mongodb+srv://admin:Admin123456@cluster0.ro4ipbw.mongodb.net/spendee?retryWrites=true&w=majority"
);

// for Registration
app.post("/register", async (req, res) => {
  const { username, password, membertype } = req.body;
  try {
    const userDoc = await User.create({ username, password, membertype });
    console.log(userDoc);
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// adding product in the user cart
app.post("/mycart", async (req, res) => {
  const {
    userId,
    productId,
    productTitle,
    productPrice,
    productCover,
    itemQuantity,
    checkBox,
  } = req.body;
  try {
    const userCart = await Cart.create({
      userId,
      productId,
      productTitle,
      productPrice,
      productCover,
      itemQuantity,
      checkBox,
    });
    console.log(userCart);
    res.json(userCart);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// updating cart item
app.put("/mycart", async (req, res) => {
  const {
    userId,
    productId,
    productTitle,
    productPrice,
    productCover,
    itemQuantity,
    checkBox,
    _id,
  } = req.body;

  try {
    const userCart = await Cart.findById(_id);
    console.log(userCart);

    await userCart.updateOne({
      userId,
      productId,
      productTitle,
      productPrice,
      productCover,
      itemQuantity,
      checkBox,
    });

    res.json(userCart);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// For Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc.password == password) {
    res
      .cookie("token", userDoc)
      .json({ id: userDoc._id, username, membertype: userDoc.membertype });
  } else {
    res.status(400).json("Incorrect Credentials");
  }
});

// to get the user profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  res.json(token);
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("OK");
});

//to remove a product in the user cart
app.post("/delete", async (req, res) => {
  const { _id } = req.body;
  const deleteProduct = await Cart.deleteOne({ _id: _id });
  res.json(deleteProduct);
});

//Posting a new product as merchant
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath); // rename the path, adding the ext

  const { title, category, price, rating, count, description, shop } = req.body;

  const postDoc = await Post.create({
    title,
    category,
    price,
    rating,
    count,
    description,
    shop,
    cover: newPath,
  });

  res.json(postDoc);
});

app.get("/post", async (req, res) => {
  const Products = await Post.find().sort({ createdAt: -1 });
  res.json(Products);
});
app.get("/mycart", async (req, res) => {
  const productList = await Cart.find();
  res.json(productList);
});

app.listen(4000);

//"mongodb+srv://admin:Admin123456@cluster0.ro4ipbw.mongodb.net/spendee?retryWrites=true&w=majority"
