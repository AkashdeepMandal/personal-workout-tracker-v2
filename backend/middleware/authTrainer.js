const authTrainer = async (req, res, next) => {
  try {
    if (req.user.role !== "trainer") {
      const authError = new Error("Please Authenticate");
      authError.status = 401;
      throw authError;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authTrainer;
