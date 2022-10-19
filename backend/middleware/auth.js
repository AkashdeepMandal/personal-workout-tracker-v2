const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({
      _id: decode._id,
      role: decode.role,
      "tokens.token": token,
    });

    if (!user) throw new Error();

    user = await user.removeInvalidTokens();

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    error.status = 401;
    error.message = "Please Authenticate";
    next(error);
  }
};

module.exports = auth;
