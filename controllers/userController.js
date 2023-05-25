const express = require("express");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const { transporter } = require("../config/mail");
const crypto = require("crypto");
const { cloudinary } = require("../config/upload");
//For getting All users Data
const getAllUsers = async (req, res, next) => {
  // const usersData = await User.find({});
  //** Agreegration */
  const usersData = await User.aggregate([
    {
      $match: {
        email: "sakibhasanalruman@gmail.com",
      },
    },
    {
      $group: {
        _id: "$email",
      },
    },
    {
      $count: "total",
    },
  ]);

  res.status(200).json({
    success: true,
    data: usersData,
  });
};

//For registration a new user
const RegisterUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //User email exists cheack
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    return res.status(400).json({
      success: false,
      data: "Email Already Exists",
    });
  }
  try {
    const saveNewUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(200).json({
      success: true,
      data: saveNewUser,
    });
    console.log(saveNewUser);
  } catch (error) {
    next(error);
  }
};

const loginuser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: "Invalid Creadentials !",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      data: "Invalid Creadentials !",
    });
  }
  // console.log(user);
  try {
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        data: "Invalid Creadentials .Password Not Match!",
      });
    }
    // console.log(user);
    const token = jwt.sign(
      { email: user.email, userId: user._id, roles: user.roles },
      process.env.JSON_WEB_TOKEN,
      { expiresIn: "10d" }
    );
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      _id: user._id,
      token,
    };
    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const authDashBoard = async (req, res, next) => {
  const email = req.user.email;
  const data = await User.find({ email });
  return res.status(201).json({
    success: true,
    data: data,
  });
};

const profileUpdate = async (req, res, next) => {
  const filePath = req.file.path;
  const result = await cloudinary.uploader.upload(filePath);
  // console.log(result);
  await fs.promises.unlink(filePath);
  const alreadyExistProfile = await Profile.findOneAndDelete({
    user: req.user.userId,
  });

  const { firstName, lastName, profilePhoto, age } = req.body;
  const updateUserProfile = new Profile({
    firstName,
    lastName,
    profilePhoto: result.secure_url,
    age,
    user: req.user.userId,
  });
  const saveDAta = await updateUserProfile.save();
  console.log(saveDAta);
  res.status(201).json({
    success: true,
    data: saveDAta,
  });
};

const showProfileImage = async (req, res, next) => {
  const { imageName } = req.params;
  const existsProfileImage = await Profile.findOne({
    profilePhoto: imageName,
  });
  if (!existsProfileImage) {
    res.status(404).json({
      success: false,
      error: "Image Not Found !",
    });
  }
  const imageShow = path.join(__dirname, "..", "images", imageName);
  res.sendFile(imageShow);
  console.log(imageShow);
};

const userMailSent = async (req, res, next) => {
  const userId = req.user.userId;
  let user = await User.findById(userId);
  if (user.isVerified) {
    return res.status(403).json({
      success: true,
      data: "You are already verified !",
    });
  } else {
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JSON_EMAIL_ACTIVATION_TOKEN,
      { expiresIn: "24h" }
    );
    const activationLink = `${process.env.BASE_URL}/api/v1/users/user-verification/${token}`;
    const contentHtml = `
    <h4>Please verify your account on clicking bellow link :</h4>
    <ul>
        <li>Your Email: ${user.email}</li>
        <li>Phone: ${user.isVerified}</li>
    </ul>
    <p>Your Verification Link is : <a href="${activationLink}">${activationLink}</a></p>
`;

    let mailSent = {
      from: process.env.MAIL_FROM, //send address
      to: user.email, // list of receviers
      subject: "Email from Nodemailer",
      html: contentHtml,
    };
    await transporter.sendMail(mailSent);

    return res.status(403).json({
      success: true,
      data: "Your verification link sent successfully !",
    });
  }
};

const userMailVerify = async (req, res, next) => {
  const token = req.params.token;
  const decodeToken = jwt.verify(
    token,
    process.env.JSON_EMAIL_ACTIVATION_TOKEN
  );

  const user = decodeToken.userId;
  const findUser = await User.findById(user);
  if (!findUser) {
    return res.status(400).json({
      success: false,
      data: "Your request is not Valid !",
    });
  }

  findUser.isVerified = true;
  findUser.save();
  res.status(400).json({
    success: false,
    data: "Your verification is successfully completed !",
  });
  console.log(findUser);
};

const passwordResetLinkSent = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      data: "Your email is not match on our credentials !",
    });
  }
  const userResetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = userResetToken;
  user.resetTokenExpiry = Date.now() + 60 * 60 * 10000; //1hour
  user.save();
  //sent mail here user to notify

  let mailSent = {
    from: process.env.MAIL_FROM, //send address
    to: user.email, // list of receviers
    subject: "Email from Nodemailer",
    html: `<p>Your password reset link is : <a href="${process.env.BASE_URL}/api/v1/users/user/password-reset/${userResetToken}">${process.env.BASE_URL}/api/v1/users/user/password-reset/${userResetToken}</a></p>`,
  };
  await transporter.sendMail(mailSent);
  return res.status(201).json({
    success: true,
    data: "Your reset password link sent on your email successfully !",
  });
};

const passwordReset = async (req, res, next) => {
  const token = req.params.token;
  const { password } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(403).json({
      success: true,
      data: "Invalid Token or reset token Expired ! !",
    });
  }

  user.password = password;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();
  let mailSent = {
    from: process.env.MAIL_FROM, //send address
    to: user.email, // list of receviers
    subject: "Email from Nodemailer",
    html: `<p>Your password reset is successfully . If you're face something is wrong then please contact with admin ${process.env.SUPPORT_MAIL}</p>`,
  };
  await transporter.sendMail(mailSent);
  return res.status(201).json({
    success: true,
    data: "Congratulations, Your password reset successfully ! !",
  });
};

module.exports = {
  getAllUsers,
  RegisterUser,
  loginuser,
  authDashBoard,
  profileUpdate,
  showProfileImage,
  userMailSent,
  userMailVerify,
  passwordReset,
  passwordResetLinkSent,
};
