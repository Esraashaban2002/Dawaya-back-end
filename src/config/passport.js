const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateToken } = require('../util/generateToken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true // ✅ عشان نوصل للـ request
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const action = req.query.state; // login أو register

      let user = await User.findOne({ 
        $or: [{ googleId: profile.id }, { email }] 
      });

      // ─── حالة LOGIN ───
      if (action === 'login') {
        if (!user) {
          return done(null, false, { 
            message: 'الحساب مش موجود — سجل حساب الأول' 
          });
        }
        // ربط الـ googleId لو مش مربوط
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // ─── حالة REGISTER ───
      if (action === 'register') {
        if (user) {
          return done(null, false, { 
            message: 'الحساب موجود بالفعل — سجل دخول' 
          });
        }
        // إنشاء حساب جديد
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email,
          isVerified: true,
          password: Math.random().toString(36).slice(-8)
        });
        return done(null, user);
      }

      return done(null, false, { message: 'action مش صح' });

    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;