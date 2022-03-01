import bcrypt from "bcryptjs";
import { Router } from "express";
import { check, validationResult } from "express-validator";
import AuthModel from "./models/auth.model.js";

import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken;
const authRouter = Router();

// /api/auth/signup
authRouter.post(
  "/signup",
  [
    check("email", "incorrect email").isEmail(),
    check("password", "Min length of password is 6 chars").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      // console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Incorrect registration data" });
      }
      const { username, email, password } = req.body;
      const candidate = await AuthModel.findOne({ username });
      if (candidate) {
        return res.status(200).json({ message: "User already exist" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await AuthModel.create({
        email,
        username,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json({ message: "User created" });
    } catch (e) {
      console.error(e.message);
      res
        .status(500)
        .json({ message: "Something went wrong. Try again later" });
    }
  }
);

// /api/auth/signin
authRouter.post(
  "/signin",
  [
    check("email", "Incorrect email").normalizeEmail().isEmail(),
    check("password", "Input password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Incorrect login data" });
      }
      const { email, password } = req.body;
      const user = await AuthModel.findOne({ email });
      if (!user) {
        return res.status(200).json({ message: "Unknown user" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(200).json({ message: "Incorrect email or password" });
      }
      const token = jwt.sign({ userId: user._id }, "nepravda", {
        expiresIn: "1h",
      });
      return res.json(token);
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "Something went wrong. Try again later" });
    }
  }
);

export default authRouter;
