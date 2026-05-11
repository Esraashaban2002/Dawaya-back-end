const jwt = require("jsonwebtoken");

exports.generateToken = async function (user, deviceInfo) {
  await user.cleanExpiredTokens();

  const MAX_DEVICES = 3;

  if (user.tokens.length >= MAX_DEVICES) {
    user.tokens = user.tokens.slice(-MAX_DEVICES + 1);
  }

  const accessToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const now = new Date();
  const accessExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  user.tokens.push({
    token: accessToken,
    deviceInfo,
    createdAt: now,
    expiresAt: accessExpiry,
  });

  await user.save({ validateBeforeSave: false });

  return accessToken;
};