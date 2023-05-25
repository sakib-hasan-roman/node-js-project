const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileData = path.parse(file.originalname);
    // const imageName = file.originalname + "=" + Date.now();
    cb(null, fileData.name + "-" + Date.now() + fileData.ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("File type Error"), false);
    }
  },
}).single("profilePhoto");

// For Extra Validation for upload Function
const uploadMiddleWare = (req, res, next) => {
  //custom upload function validate ....
  upload(req, res, (error) => {
    if (error) {
      //if has multer Error ....
      if (error instanceof multer.MulterError) {
        if (error.code == "LIMIT_FILE_SIZE") {
          res.status(400).json({
            success: false,
            error: "File Size too Large !",
          });
        } else {
          // multer another error .....
          res.status(400).json({
            success: false,
            error: error.message,
          });
        }
      } else {
        //not multer Error and its upload error function .....
        res.status(400).json({
          success: false,
          error: error.message,
        });
      }
    }

    //if user not select any file ....
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: "File Not Found " + req.file,
      });
    }
    next();
  });
};

module.exports = uploadMiddleWare;
