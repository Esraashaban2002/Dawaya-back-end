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
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });
 
    //بعت الـ role مع الـ redirect عشان الـ frontend يعرف يروح فين
    const role = req.user.role || 'user';
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?role=${role}`);
 
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${error.message}`);
  }
};