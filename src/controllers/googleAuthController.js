const passport = require('passport');
require('../config/passport');
const { generateToken } = require('../util/generateToken');

// GET /api/auth/google?action=login
exports.googleAuth = (req, res, next) => {
  const action = req.query.action || 'login';

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: action
  })(req, res, next);
};

// GET /api/auth/google/callback — middleware
exports.googleCallback = async (req, res, next) => {
  try {
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const accessToken = await generateToken(req.user, deviceInfo);

    // Redirect للـ Frontend مع الـ token
    res.redirect(`${process.env.FRONTEND_URL}/?token=${accessToken}`);

  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${error.message}`);
  }
};

exports.googleFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('فشل تسجيل الدخول بـ Google')}`);
};