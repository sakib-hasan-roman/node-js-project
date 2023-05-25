const mongoose = require("mongoose");

const todosSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [5, "Minimum Length 5 characters required !"],
      maxLength: [50, "Maximum Length 50 characters !"],
    },
    description: {
      type: String,
      required: true,
      minLength: [5, "Minimum Length 5 characters required !"],
      maxLength: [50, "Maximum Length 50 characters !"],
    },
    completed: {
      type: Boolean,
      default: false,
      enum: ["true", "false"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//statics = Todo.getTodo()

//methods = new Todo()
todosSchema.methods.CompleteUpdatedTodo = function () {
  this.completed = true;
  return this.save();
};

//virtul - Its create at a new virtual field on collections
todosSchema.virtual("status").get(function () {
  return this.completed ? "Done" : "Pending";
});

todosSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Todo", todosSchema);
