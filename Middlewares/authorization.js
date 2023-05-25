const jwt = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: true,
      data: "Token Not Found !",
    });
  }
  //now verify if have token already
  jwt.verify(token, process.env.JSON_WEB_TOKEN, async (error, decodedData) => {
    if (error) {
      return res.status(400).json({
        success: false,
        data: "Something went Wrong ! " + error,
      });
    }
    req.user = decodedData;
    next();
  });
};

module.exports = authorization;
