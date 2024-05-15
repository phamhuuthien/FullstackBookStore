const Category = require("../model/category");

const getListCategory = async (req, res) => {
  try {
    const response = await Category.find();
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "missing input",
      });
    }
    const nameCategory = await Category.findOne({ name });
    if (nameCategory) {
      return res.status(400).json({
        success: false,
        message: "name category already exist",
      });
    }
    const response = await Category.create(req.body);
    res.status(200).json({
      success: true,
      message: "category added successfully",
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (name) {
      const nameCategory = await Category.findOne({
        name,
        _id: { $ne: id },
      });
      if (nameCategory) {
        return res.status(400).json({
          success: false,
          message: "name category already exist",
        });
      }
    }
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "update successfully",
      data: updateCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message :"delete successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getListCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
