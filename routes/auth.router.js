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
      const emailUnique = await AuthModel.findOne({ email });
      if (emailUnique) {
        return res.status(200).json({ message: "Email is taken" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await AuthModel.create({
        email,
        username,
        password: hashedPassword,
      });
      await user.save();
      const token = jwt.sign({ username: user.username }, "nepravda", {
        expiresIn: "1h",
      });
      return res.status(201).json({
        message: "User created",
        token: token,
      });
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
      // console.log(errors);
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
      const token = jwt.sign({ username: user.username }, "nepravda", {
        expiresIn: "1h",
      });
      return res.json({ token: token });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "Something went wrong. Try again later" });
    }
  }
);
authRouter.get("/getuser/:username", async (req, res) => {
  try {
    const username = req.params;

    const user = await AuthModel.findOne(username);
    return res.json({ user: user });
  } catch (e) {
    console.error(e.message);
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again later" });
  }
});
authRouter.delete("/deleteuser", async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    const user = await AuthModel.findOne({ username: username });
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      user.delete();
      return res.status(200).json({ message: "User successfully deleted" });
    } else {
      return res.status(200).json({ message: "Incorrect  password" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again later" });
  }
});
authRouter.post("/uptade/password", async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { username, oldPassword, newPassword } = req.body;
    const user = await AuthModel.findOne({ username });
    // console.log("user: ", user);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Incorrect old password" });
    } else {
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      const checkich = await AuthModel.updateOne(
        { username },
        { $set: { password: hashedNewPassword } }
      );

      return res.status(200).json({ message: "Password changed" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again later" });
  }
});
authRouter.post("/uptade/info", async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { id, username, email, description } = req.body;
    const user = await AuthModel.findOne({ id });
    console.log(user.email, " and ", user.username);
    const emailCheck = await AuthModel.findOne({ email });
    const usernameCheck = await AuthModel.findOne({ username });
    if (emailCheck && usernameCheck) {
      if (user.id != emailCheck.id) {
        return res.status(200).json({ message: "Email is taken" });
      } else if (user.id != usernameCheck.id) {
        return res.status(200).json({ message: "Username is taken" });
      } else {
        const updateAll = await AuthModel.updateOne(
          { id },
          {
            $set: {
              username: username,
              email: email,
              description: description,
            },
          }
        );
        return res.status(200).json({ message: "Information updated!" });
      }
    } else if (emailCheck) {
      console.log("Email check: ", emailCheck.email);
      if (user.id != emailCheck.id) {
        return res.status(200).json({ message: "Email is taken" });
      } else {
        const updateAll = await AuthModel.updateOne(
          { id },
          {
            $set: {
              username: username,
              email: email,
              description: description,
            },
          }
        );
        return res.status(200).json({ message: "Information updated!" });
      }
    }
    if (usernameCheck) {
      console.log("name check: ", usernameCheck.username);
      if (user.id != usernameCheck.id) {
        return res.status(200).json({ message: "Username is taken" });
      } else {
        const updateAll = await AuthModel.updateOne(
          { id },
          {
            $set: {
              username: username,
              email: email,
              description: description,
            },
          }
        );
        return res.status(200).json({ message: "Information updated!" });
      }
    } else {
      const updateAll = await AuthModel.updateOne(
        { id },
        {
          $set: {
            username: username,
            email: email,
            description: description,
          },
        }
      );
      return res.status(200).json({ message: "Information updated!" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Something went wrong. Try again later" });
  }
});

export default authRouter;
