import { Router } from "express";
import ProductModel from "./models/product.model.js";

const searchRouter = Router();

searchRouter.get("/search", async (req, res) => {
  try {
    const { value } = req.query;
    const data = await ProductModel.find();
    const result = data.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    console.log(value);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again later" });
  }
});

//api/search?=v=

export default searchRouter;
