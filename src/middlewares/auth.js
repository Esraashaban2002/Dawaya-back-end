const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../util/response");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return errorResponse(res ,401 , "No token provided");

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error("User not found");

    await user.cleanExpiredTokens();

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    errorResponse(res ,401 , "Please authenticate" );
  }
};

function checkRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res ,403 , 'مش مسموحلك بالدخول' )
    }
    next();
  };
}
module.exports = {
  auth,
  isAdmin: checkRole("admin"),
  isUser: checkRole("user"),
  isPharmacist: checkRole("pharmacist")
};