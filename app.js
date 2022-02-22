// import mongoose from "mongoose";
const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use("/api/products/all", require("./routes/products.routes"));

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
