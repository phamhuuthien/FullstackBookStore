
const Role = require("../model/role")

const getAllRole = async (req, res) => {
  const response = await Role.find();
  return res.status(200).json({
    success: true,
    date: response,
  });
};

const createRole = async (req, res) => {
  const roleName = req.body.roleName;
  if (!roleName) {
    return res.status(400).json({
      success: false,
      mes: "missing inputs",
    });
  }
  const role = await Role.findOne({ roleName: roleName });
  if (role) {
    return res.status(400).json({
      success: false,
      mes: "role has existed",
    });
  } else {
    const newRole = await Role.create(req.body);
    return res.status(200).json({
      success: true,
      mes: newRole,
    });
  }
};

const deleteRole = async (req, res) => {
  const { rid } = req.params;
  console.log(rid);
  const deleteRole = await Role.findByIdAndDelete(rid);
  return res.status(200).json({
    success: deleteRole ? true : false,
    message: deleteRole ? "delete role successfully" : "cannot delete role",
  });
};

const updateRole = async (req, res) => {
  const { rid } = req.params;
  const data = req.body;
  if (Object.keys(data).length === 0) {
    return res.json.status(400).json({
      success: false,
      message: "missing input",
    });
  }
  const response = await Role.findByIdAndUpdate(rid, data, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    message: response ? "update role successfully" : "update role failed",
  });
};

module.exports = {
  getAllRole,
  createRole,
  updateRole,
  deleteRole
};