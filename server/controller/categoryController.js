const category = require('../model/category');

const getListCategory = async (req,res) => {
    try {
          const categorys = await category.find();
          res.status(200).json(categorys);
    } catch (err) {
        res.status(500).json(err);
    }
}

const addCategory = async (req,res) => {
    try {
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();
        res.status(200).json(savedCategory);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateCategory =  async (req,res) => {
    try {
        const updateCategory = await Category.findByIdAndUpdate(req.params.cid, {
            $set : req.body
        }, 
          {
             new : true
        });
        res.status(200).json(updateCategory);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteCategory = async (req,res) => {
    try {
        await Category.findByIdAndDelete(req.params.cid);
        res.status(200).json(" Category has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
}
 
module.exports = { getListCategory, addCategory, updateCategory, deleteCategory } ;