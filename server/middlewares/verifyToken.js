const jwt = require('jsonwebtoken')
const roleModel = require('../model/role')

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.accessToken; // Access token from cookie

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing access token in cookie", // More descriptive message
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token", // More descriptive message
      });
    }

    req.user = decoded;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const { role } = req.user;
  const roleName = await roleModel.findById(role);
  if (roleName.roleName !== "admin") {
    return res.status(401).json({
      success: false,
      mes: "required role admin !!",
    });
  }
  // throw new Error('required role admin')
  next();
};

const isShipper = async (req, res, next) => {
  const { role } = req.user;
  const roleName = await roleModel.findById(role);
  if (roleName.roleName !== "shipper") {
    return res.status(401).json({
      success: false,
      mes: "required role admin !!",
    });
  }
  // throw new Error('required role admin')
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isShipper,
};