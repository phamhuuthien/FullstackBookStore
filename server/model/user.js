// !mdbgum
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    cart: [
      {
        book: { type: mongoose.Types.ObjectId, ref: "Book" },
        quantity: Number,
      },
    ],
    isBlocked: { type: Boolean, default: true },
    address: String,
    refreshToken: { type: String },
    passwordChangedAt: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: String },
    otp: { type: String },
    otpExpires: { type: String },
  },
  {
    timestamps: true,
  }
);

// pre : trước khi lưu thì làm gì
userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  // do trường hợp save trong otp hắn cx lấy password đã mã hóa đi mã hóa tiếp r lưu lại
  if (this.password.length < 20) {
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return bcrypt.compareSync(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    // set thời gian sống của token
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
  createOtp: function () {
    const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
    this.otp = OTP;
    this.otpExpires = Date.now() + 8 * 60 * 1000;
    return OTP;
  },
};

module.exports = mongoose.model("User", userSchema);
