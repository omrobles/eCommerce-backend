const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authorization");

router.get("/get-users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users });
  } catch (error) {
    res.status(500).json({ msg: "Error loading data from database" });
  }
});

// Create user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let foundUser = await User.findOne({ email });
    if (!foundUser) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
      });

      const payload = {
        user: {
          id: newUser._id,
        },
      };

      jwt.sign(payload, process.env.SECRET, { expiresIn: 360000 }, (error, token) => {
        if (error) throw error;
        res.json({ token });
      });
    } else {
      return res.status(400).json({ msg: "User already exist" });
    }
  } catch (error) {
    return res.status(400).json({
      msg: error,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ msg: "User not found." });
    }

    const passwordCheck = await bcryptjs.compare(password, foundUser.password);
    if (!passwordCheck) {
      return await res.status(400).json({ msg: "Incorrect Password." });
    }

    const payload = {
      user: {
        id: foundUser._id,
      },
    };

    if (email && passwordCheck) {
      jwt.sign(payload, process.env.SECRET, { expiresIn: 360000 }, (error, token) => {
        if (error) throw error;
        res.json({ token });
      });
    } else {
      res.json({ msg: "An error ocurred in validation of data.", error });
    }
  } catch (error) {
    res.json({ msg: "An error ocurred sending request.", error });
  }
});

router.get("/verify-user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({
      msg: "An error ocurred verifying user.",
      error,
    });
  }
});

router.put("/update-user", auth, async (req, res) => {
  const { name, email, address, cart, orders } = req.body;
  console.log(req.body);
  try {
    const userUpdate = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, address, $addToSet: { cart: cart, orders: orders } },
      { new: true }
    ).select("-password");
    res.json(userUpdate);
  } catch (error) {
    res.status(500).json({
      msg: "An error ocurred updating user data.",
      error,
    });
  }
});

router.put("/update-cart", auth, async (req, res) => {
  const { name, email, address, cart, orders } = req.body;
  try {
    const cartUpdate = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, address, $pull: { cart: cart, orders: orders } },
      { new: true }
    ).select("-password");
    res.json(cartUpdate);
  } catch (error) {
    res.status(500).json({
      msg: "An error ocurred updating user data.",
      error,
    });
  }
});

router.put("/clear-cart", auth, async (req, res) => {
  const { name, email, address, cart, orders } = req.body;
  try {
    const cartUpdate = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, address, $set: { cart: [] }, $addToSet: { orders: orders } },
      { new: true }
    ).select("-password");
    res.json(cartUpdate);
  } catch (error) {
    res.status(500).json({
      msg: "An error ocurred updating user data.",
      error,
    });
  }
});

module.exports = router;
