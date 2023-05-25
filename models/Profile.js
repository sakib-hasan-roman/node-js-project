const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First Name Minimum three digits required !"],
    maxLength: [10, "First Name Maximum ten digits required !"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last Name Minimum three digits required !"],
    maxLength: [10, "Last Name Maximum ten digits required !"],
  },
  profilePhoto: {
    type: String,
  },
  age: {
    type: Number,
    default: 18,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Profile", profileSchema);
