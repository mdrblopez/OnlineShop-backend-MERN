const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: String,
    category: String,
    price: Number,
    rating: Number,
    count: Number,
    description: String,
    shop: String,
    cover: String,
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Post", PostSchema);
module.exports = PostModel;
