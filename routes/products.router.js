import { Router } from "express";
import ProductModel from "./models/product.model.js";

const productsRouter = Router();

//api/products/all
productsRouter.get("/all", async (req, res) => {
  try {
    const data = await ProductModel.find();
    if (!data) {
      return res.status(400).json({ message: "Invalid" });
    }
    return res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong. Try again later" });
  }
});

// api/products/windows
// productsRouter.get("/:platform", async (req, res) => {
//   try {
//     const platform = req.params.platform;
//     if (platform != "all") {
//       const data = await ProductModel.find({ [platform]: true });
//       return res.status(200).json(data);
//     } else return res.status(404).json({ message: "Not found" });
//   } catch (e) {
//     res.status(500).json({ message: "Something went wrong. Try again later" });
//   }
// });

productsRouter.post("/create", async (req, res) => {
  try {
    console.log(req.body);
    const { title, price, image, mac, win, linux, rating, description, color } =
      req.body;
    const data = await ProductModel.findOne({ title }, {}, { lean: true });
    console.log(data);
    if (data)
      return res.status(400).json({ message: "Product is already created" });
    await ProductModel.create({
      title,
      price,
      image,
      mac,
      win,
      linux,
      rating,
      description,
      color,
    });

    return res.sendStatus(201);
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again later" });
  }
});

export default productsRouter;
