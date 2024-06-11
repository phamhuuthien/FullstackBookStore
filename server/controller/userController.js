const User = require("../model/user");
const Role = require("../model/role");
const Book = require("../model/book");
const jwt = require("jsonwebtoken");
const {
  genderateAccessToken,
  genderateRefreshToken,
} = require("../middlewares/jwt");

const crypto = require("crypto");
const sendMail = require("../until/sendMail");

const register = async (req, res) => {
  const { firstname, lastname, password, email, mobile } = req.body;
  if (!firstname || !lastname || !password || !email || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "missing inputs",
    });
  }
  const role = await Role.findOne({ roleName: "user" });
  const user = await User.findOne({ email: email });
  const mobileUser = await User.findOne({ mobile: mobile });
  if (user) {
    var responeMessage = {
      message: "Email already exists",
      user: req.body,
    };
    return res.render("Pages/registration", { responeMessage });
  } else if (mobileUser) {
    var responeMessage = {
      message: "Mobile already exists",
      user: req.body,
    };
    return res.render("Pages/registration", { responeMessage });
  } else {
    await User.create({ ...req.body, role: role._id });
    res.redirect(`/user/sendOtp?email=${email}`);
    // res.redirect("/");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    // return res.status(400).json({
    //   success: false,
    //   mes: "missing inputs",
    // });
    return res.render("Pages/login", { message: "missing inputs" });
  }

  const dataUser = await User.findOne({ email });
  if (dataUser && (await dataUser.isCorrectPassword(password))) {
    if (dataUser && dataUser.isBlocked) {
      // return res.status(400).json({
      //   success: false,
      //   mes: "login falied : account is blocked",
      // });
      return res.render("Pages/login", {
        message: "login falied : account is blocked",
      });
    }
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
    const roleObject = await Role.findById(role);
    if (roleObject.roleName == "user") {
      res.redirect("/");
    } else {
      res.render("admin/index", { user: user });
    }
    // return res.status(200).json({
    //   success: true,
    //   newAccessToken,
    //   userdata: user,
    // });
    // res.render("index", { user: user });
  } else {
    return res.render("Pages/login", {
      message: "login falied : password is corrrect or account does not exist",
    });
    // return res.status(400).json({
    //   success: false,
    //   mes: "password is corrrect or account does not exist",
    // });
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
  return res.redirect("/");
};

const getUser = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  res.render("Pages/infoAccount", { user });
};

const getAllUsers = async (req, res) => {
  const role = await Role.findOne({ roleName: "user" });
  const response = await User.find({ role: role._id }).select(
    "-refreshToken -password -role"
  );
  res.render("admin/customer", { response });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const user = User.findById(_id);
  const data = req.body;
  const email = data.email;
  if (email) {
    const emailSearch = await User.findOne({
      email,
      _id: { $ne: _id },
    });
    if (emailSearch) {
      // return res.status(400).json({
      //   success: false,
      //   message: "email already exist",
      // });
      return res.redirect("getUser");
    }
  }
  if (Object.keys(data).length === 0) {
    // return res.status(400).json({
    //   success: false,
    //   message: "missing input",
    // });
    return res.redirect("getUser");
  } else {
    await User.findByIdAndUpdate(_id, data, {
      new: true,
    }).select("-refreshToken -password -role");
    res.redirect("/");
  }
};

const deleteUser = async (req, res) => {
  const { _id } = req.query;
  const response = await User.findByIdAndDelete(_id, { new: true });
  res.redirect(process.env.URL + "/admin/customer");
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
  res.redirect(process.env.URL + "/admin/customer");
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
  // return res.json({
  //   success: true,
  //   mess: user ? "updated password" : "something went wrong",
  // });
  res.render("Pages/login");
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

    const html = `xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. link này sẽ hết hạn sau 15 phút kể từ bây giờ <a href=${process.env.URL_SERVER}/resetPassword/${tokenChangePassword} >click here</a>`;

    const data = {
      email,
      html,
    };
    const rs = await sendMail(data);
    // return res.status(200).json({
    //   success: true,
    //   rs,
    // });
    res.render("Pages/login", { message: " vui long kiem tra email" });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.query;
  if (email == null) {
    return res.status(400).json({
      success: false,
      message: "missing input",
    });
  }
  const user = await User.findOne({ email: email });

  if (user) {
    const otp = user.createOtp();
    await user.save();

    const html = `đây là ${otp} của bạn`;

    const data = {
      email,
      html,
    };
    const rs = await sendMail(data);
    // return res.status(200).json({
    //   success: true,
    //   rs,
    // });
    res.render("Pages/OTP", { email });
  }
};

const verifyOtp = async (req, res) => {
  const { email, verifyOtp } = req.body;
  if (!email || !verifyOtp) {
    return res.status(400).json({
      success: false,
      message: "missing input",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    if (user.otp == verifyOtp && user.otpExpires - Date.now() > 0) {
      user.isBlocked = false;
      user.otp = undefined;
      user.otpExpires = undefined;
      user.save();
      // return res.status(200).json({
      //   success: true,
      //   message: "success",
      // });
      return res.redirect("/");
    }
    // return res.status(200).json({
    //   success: false,
    //   message: "gui lai otp",
    // });
    return res.render("Pages/OTP", { email, message: "otp is not correct" });
  }
  return res.status(400).json({
    success: false,
    message: "user khong ton tai",
  });
};

const addCart = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("cart");
  const { bid } = req.params;
  if (user) {
    if (!bid) {
      return res.status(400).json({
        success: false,
        message: "missing input",
      });
    }

    // kiểm tra quyển sách đó có trong cart chưa . Nếu có rồi thì lấy quantity cộng lên

    const checkBookInCart = await user.cart.find(
      (item) =>
        // console.log(item.book.toString())
        item.book.toString() === bid
    );
    if (checkBookInCart) {
      const currentQuantity = checkBookInCart.quantity + 1;
      const response = await User.updateOne(
        { cart: { $elemMatch: checkBookInCart } },
        { $set: { "cart.$.quantity": currentQuantity } },
        { new: true }
      );
      // return res.status(200).json({
      //   sucess: response ? true : false,
      //   rs: response,
      // });

      res.redirect("/");
    } else {
      // const book = await Book.findById(bid);
      // if(book.quantity > 0){
      //   await Book.findByIdAndUpdate(bid, { $inc: { quantity: -1 } }, { new: true })
      // }else{
      //   return res.status(401).json({
      //     success : false,
      //     message : "quantity is not enough"
      //   })
      // }
      // thêm khi chưa có trong giỏ hàng
      const response = await User.findByIdAndUpdate(
        _id,
        {
          $push: { cart: { book: bid, quantity: 1 } },
        },
        { new: true }
      );
      // return res.status(200).json({
      //   sucess: response ? true : false,
      //   rs: response,
      // });
      res.redirect("/");
    }
  }
};

const addQuantity = async (req, res) => {
  const { _id } = req.user;
  const { quantity } = req.query;
  const user = await User.findById(_id).select("cart");
  const { bid } = req.params;
  const book = await Book.findById(bid);
  if (user) {
    if (!bid) {
      return res.status(400).json({
        success: false,
        message: "missing input",
      });
    }
    const checkBookInCart = await user.cart.find(
      (item) => item.book.toString() === bid
    );
    if (checkBookInCart) {
      var currentQuantity;
      if (quantity === "desc") {
        currentQuantity = checkBookInCart.quantity - 1;
      } else {
        if (book.quantity > checkBookInCart.quantity) {
          currentQuantity = checkBookInCart.quantity + 1;
        } else {
          currentQuantity = checkBookInCart.quantity;
        }
      }
      const response = await User.updateOne(
        { cart: { $elemMatch: checkBookInCart } },
        { $set: { "cart.$.quantity": currentQuantity } },
        { new: true }
      );
      // await Book.findByIdAndUpdate(bid, { $set: { quantity: currentQuantity } }, { new: true })
      res.redirect("/cart-item");
    }
  }
};

const removeCart = async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  const user = await User.findById(_id).select("cart");
  if (user) {
    const carts = user.cart;
    // for (let i = 0; i < carts.length; i++) {
    //   if (carts[i].book.toString() === bid) {
    //     carts.pop(carts[i]);
    //     break;
    //   }
    // }
    // carts.find((item) => {
    //   if (item.book.toString() === bid) {
    //     carts.pop(item);
    //   }
    // });
    const filteredCarts = carts.filter((item) => item.book.toString() !== bid);
    const response = await User.updateOne(
      { _id: user._id },
      { $set: { cart: filteredCarts } },
      { new: true }
    );
    res.redirect("/cart-item");
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
  addCart,
  removeCart,
  addQuantity,
  sendOtp,
  verifyOtp,
};
