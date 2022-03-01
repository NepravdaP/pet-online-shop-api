import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const authSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${uuidv4()}`,
    },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
const AuthModel = mongoose.model("Auth", authSchema);

export default AuthModel;
