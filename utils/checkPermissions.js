const CustomError = require("../errors");
const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "You are not allowed to proceed this operation"
  );
};

module.exports = checkPermissions;

/* const checkPermissions = (user, id) => {
    if (user.role === "user") {
      if (user.userId === id.userId) {
        console.log("user.userId");
        return true;
      } else return false;
    }
    return true;
  }; */
