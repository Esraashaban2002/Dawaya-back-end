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

    res.cookie('token', accessToken, {
      httpOnly: false, // لو عاوز الفرونت يقرأه بـ JS
      secure: true,    // لازم true لو https
      sameSite: 'none', // عشان cross-domain
      maxAge: 24 * 60 * 60 * 1000 // يوم مثلاً
    });

    res.redirect(`${process.env.FRONTEND_URL}/`);

  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${error.message}`);
  }
};

exports.googleFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('فشل تسجيل الدخول بـ Google')}`);
};