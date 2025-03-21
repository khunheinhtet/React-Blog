import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    // Generate an access token
    const accessToken = jwt.sign({ id: user._id, name: user.username, email: user.email }, process.env.JWT_SECRET);
    
    res.status(200).json({ user, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "Wrong credentials!" });
    }
    
    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      return res.status(400).json({ message: "Wrong credentials!" });
    }

    const { password, ...others } = user._doc;
    const accessToken = jwt.sign({ id: others._id, name: others.username, email: others.email }, process.env.JWT_SECRET);
    res.status(200).json({ others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;