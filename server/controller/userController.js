const User = require("../model/user");
const {
  genderateAccessToken,
  genderateRefreshToken,
} = require("../middlewares/jwt");
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

    res.cookie("accessToken", newRefreshToken, {
      maxAge: 5 * 24 * 60 * 60 * 1000
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

module.exports = {
  register,
  login,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
