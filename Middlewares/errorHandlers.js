const errorHandler = (error, req, res, next) => {
  //   console.log({ error });
  //   console.log("error", error.errors);
  if (error.name === "validationError") {
    const message = Object.values(error.errors).map((err) => {
      res.status(400).json({
        success: false,
        errors: message,
      });
    });
  } else if (error.name === "CastError") {
    res.status(400).json({
      success: false,
      errors: "Invalid Id",
    });
  } else {
    res.status(500).json({
      success: false,
      errors: "Invalid server Error !",
    });
  }
};
module.exports = errorHandler;
