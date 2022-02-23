import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const productsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${uuidv4()}`,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    win: { type: Boolean, required: true },
    mac: { type: Boolean, required: true },
    linux: { type: Boolean, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);
const ProductModel = mongoose.model("Products", productsSchema);

export default ProductModel;
