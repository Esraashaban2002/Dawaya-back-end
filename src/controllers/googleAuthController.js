const passport = require('passport');
require('../config/passport');
const { generateToken } = require('../util/generateToken')

// GET /api/auth/google?action=login
exports.googleAuth = (req, res, next) => {
  const action = req.query.action || 'login'; // default login

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: action // بنبعت action للـ callback
  })(req, res, next);
};

// GET /api/auth/google/callback
exports.googleCallback = async (req, res) => {
  try {
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const accessToken = await generateToken(req.user, deviceInfo);

    res.status(200).json({
      success: true,
      accessToken,
      user: req.user
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// لما بيفشل — بيجي هنا
exports.googleFailure = (req, res) => {
  res.status(401).json({ 
    success: false, 
    message: req.query.message || 'فشل تسجيل الدخول بـ Google' 
  });
};