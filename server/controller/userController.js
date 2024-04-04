const User = require("../model/user");
const jwt = require("jsonwebtoken");
const {
  genderateAccessToken,
  genderateRefreshToken,
} = require("../middlewares/jwt");

const crypto = require("crypto");
const sendMail = require("../until/sendMail");

const register = async (req, res) => {
  const { firstname, lastname, password, email, mobile, role } = req.body;
  if (!firstname || !lastname || !password || !email || !mobile || !role) {
    return res.status(400).json({
      success: false,
      mes: "missing inputs",
    });
  }
  const user = await User.findOne({ email: email });
  const mobileUser = await User.findOne({ mobile: mobile });
  if (user) {
    return res.status(401).json({
      success: false,
      mes: "user has existed",
    });
  } else if (mobileUser) {
    return res.status(401).json({
      success: false,
      mes: "mobile has existed",
    });
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser
        ? "Register is successfully. Please go login"
        : "something went wrong",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({
      success: false,
      mes: "missing inputs",
    });
  }

  const dataUser = await User.findOne({ email });
  if (dataUser && (await dataUser.isCorrectPassword(password))) {
    const { _id, password, role, refreshToken, ...user } = dataUser.toObject();

    const newAccessToken = genderateAccessToken(dataUser._id, role);
    const newRefreshToken = genderateRefreshToken(dataUser._id);

    await User.findByIdAndUpdate(
      dataUser._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.cookie("accessToken", newAccessToken, {
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      newAccessToken,
      userdata: user,
    });
  } else {
    return res.status(400).json({
      success: false,
      mes: "login falied",
    });
  }
};

const logOut = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.accessToken && !cookie.refreshToken) {
    return res.status(400).json({
      success: false,
      message: "please login !",
    });
  }
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: " " },
    { new: true }
  );

  res.clearCookie("accessToken", { httpOnly: true, secure: true });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });

  return res.json({
    success: true,
    mess: "logout successfully",
  });
};

const getUser = async (req, res) => {
  const { _id } = req.user;
  const response = await User.findById(_id);
  return res.status(200).json({
    success: response ? true : false,
    user: response,
  });
};

const getAllUsers = async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    user: response,
  });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const data = req.body;
  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "missing input",
    });
  } else {
    const response = await User.findByIdAndUpdate(_id, data, {
      new: true,
    }).select("-refreshToken -password -role");
    return res.status(200).json({
      success: response ? true : false,
      user: response,
    });
  }
};

const deleteUser = async (req, res) => {
  const { _id } = req.query;
  const response = await User.findByIdAndDelete(_id, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    user: `success delete account with emial ${response.email}`,
  });
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "refreshTokens do not exist",
    });
  }

  const rs = await jwt.verify(refreshToken, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: rs._id, refreshToken });

  const accessToken = genderateAccessToken(user._id, user.role);

  res.clearCookie("accessToken", { httpOnly: true, secure: true });

  res.cookie("accessToken", accessToken, {
    maxAge: 5 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: accessToken,
  });
};

const isBlocked = async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById(_id);
  let isBlocked;
  if (user.isBlocked) {
    await User.findByIdAndUpdate(
      _id,
      { $set: { isBlocked: false } },
      { new: true }
    );
    isBlocked = false;
  } else {
    await User.findByIdAndUpdate(
      _id,
      { $set: { isBlocked: true } },
      { new: true }
    );
    isBlocked = true;
  }
  return res.status(200).json({
    success: true,
    message: isBlocked ? "locked user" : "unlocked user",
  });
};

const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) {
    return res.status(400).json({
      success: false,
      message: "missing input",
    });
  }
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({ passwordResetToken: passwordResetToken });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "invalid passwordResetToken",
    });
  }
  user.password = password;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return res.json({
    success: true,
    mess: user ? "updated password" : "something went wrong",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.query;
  if (email == null) {
    return res.status(400).json({
      success: false,
      message: "missing input",
    });
  }
  const user = await User.findOne({ email: email });

  if (user) {
    const tokenChangePassword = user.createPasswordChangedToken();

    await user.save();

    const html = `xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. link này sẽ hết hạn sau 15 phút kể từ bây giờ <a href=${process.env.URL_SERVER}/api/v1/user/resetPassword/${tokenChangePassword} >click here</a>`;

    const data = {
      email,
      html,
    };
    const rs = await sendMail(data);
    return res.status(200).json({
      success: true,
      rs,
    });
  }
};

module.exports = {
  register,
  login,
  logOut,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  refreshAccessToken,
  isBlocked,
  resetPassword,
  forgotPassword,
};
