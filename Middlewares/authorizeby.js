const Todo = require("../models/Todo");

const authorizeBy =
  (...roles) =>
  async (req, res, next) => {
    // console.log(roles);
    // console.log(req.user);

    const userRole = req.user.roles;
    const allowRoles = roles;

    const allowUserPermission = allowRoles.some((allowrole) =>
      userRole.includes(allowrole)
    );
    if (!allowUserPermission) {
      return res.status(403).json({
        success: false,
        data: "Unathorize ! ",
      });
    }

    // const todo = await Todo.findOne({
    //   user: req.user.userId,
    //   _id: req.params.id,
    // });
    // if (!todo) {
    //   return res.status(403).json({
    //     success: false,
    //     data: "Unathorize ! ",
    //   });
    // }
    next();
  };

module.exports = authorizeBy;
