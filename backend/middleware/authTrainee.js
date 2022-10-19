const authTrainee = async (req, res, next) => {
  try {
    if (req.user.role !== "trainee") {
      const authError = new Error("Please Authenticate");
      authError.status = 401;
      throw authError;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authTrainee;
