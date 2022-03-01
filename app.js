import mongoose from "mongoose";
// const mongoose = require("mongoose");
import express from "express";
// const express = require("express");
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.router.js";
import productsRouter from "./routes/products.router.js";
import searchRouter from "./routes/search.router.js";
const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// app.use(express.json());

app.use(cors());
app.options("*", cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api", searchRouter);
const start = async () => {
  try {
    app.listen(5000, () => {
      console.log("App has been started");
    });
    await mongoose.connect(
      "mongodb+srv://pNepravda:2771566p@cluster0.brte1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {}
    );
  } catch (e) {
    console.log("Server Error:", e.message);
    process.exit(1);
  }
};

start();
