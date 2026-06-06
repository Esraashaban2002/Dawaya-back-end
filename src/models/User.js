const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcrypt')
const jwt = require("jsonwebtoken");

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add name'],
    trim: true
  },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    minlength: 8,
    select: false,
    validate(value) {
       if (this.googleId) return;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

      if (!passwordRegex.test(value)) {
        throw new Error(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        );
      }
    }
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is INVALID");
      }
    },
  },
  phone: {
    type: String,
    required: function() { return !this.googleId; },
    minlength: 11,
    maxlength: 11
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    required: function() { return !this.googleId; },
    enum: ["male", "female"],
  },
  role: {
    type: String,
    enum: ["admin", "user", "pharmacist"],
    default: "user",
    trim: true,
  },
  googleId: {
  type: String,
  default: null
},
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpire: {
    type: Date
  },
  resetPasswordOtp: {
    type: String
  },
  resetPasswordOtpExpire: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      token: String,
      deviceInfo: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: Date,
    },
  ],
}, { timestamps: true })


// hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt);
});

// compare password 
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password)
}


userSchema.methods.cleanExpiredTokens = async function () {
  const user = this;
  const now = new Date();
  user.tokens = user.tokens.filter((t) => t.expiresAt > now);
};

//  hide sensetive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;