const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();
const baseRoute = "/api/user";

// register new user
// {baseUrl}/{baserRoute}/create
router.post(`${baseRoute}/create`, async (req, res, next) => {
  console.log(req.body);
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      const errorMsg = new Error("Already have an account");
      errorMsg.status = 400;
      throw errorMsg;
    }

    const newUser = new User({ ...req.body });
    console.log(newUser);
    const user = await newUser.save();
    const authToken = await newUser.generateAuthToken(false);

    res.status(200).send({ user, authToken });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

// login user
// {baseUrl}/{baserRoute}/login
router.post(`${baseRoute}/login`, async (req, res, next) => {
  try {
    let user = await User.findUserByCredential(
      req.body.email,
      req.body.password
    );
    const authToken = await user.generateAuthToken(req.body?.remember);
    user = await user.removeInvalidTokens();
    res.status(200).send({ user, authToken });
  } catch (error) {
    error.status = 401;
    next(error);
  }
});

// logout user
// {baseUrl}/{baserRoute}/logout
router.post(`${baseRoute}/logout`, auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({ message: "logout successful" });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

module.exports = router;
