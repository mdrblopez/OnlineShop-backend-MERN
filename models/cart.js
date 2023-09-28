const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CartSchema = new Schema({
  userId: { type: String, require: true },
  productId: { type: String, required: true },
  productTitle: { type: String, required: true },
  productPrice: { type: String, required: true },
  productCover: { type: String, required: true },
  itemQuantity: { type: String, required: true },
  checkBox: { type: Boolean, required: true },
});

const CartModel = model("Cart", CartSchema);
module.exports = CartModel;
