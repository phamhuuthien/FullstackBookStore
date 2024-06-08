const Author = require('../model/author');

const getDetailAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await Author.findById(id);
    res.status(200).json({
      success: true,
      message: "get detail author",
      data: author,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getListAuthor = async (req, res) => {
  try {
    const response = (await Author.find()).reverse();
    res.render("admin/author", { response });
    // res.status(200).json(author);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getListAuthorJson = async (req, res) => {
  try {
    const response = (await Author.find()).reverse();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
};

getListAuthorJson

const addAuthor = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "missing input",
      });
    }
    const emailSearch = await Author.findOne({ email });
    if (emailSearch) {
      return res.status(400).json({
        success: false,
        message: "email already exist",
      });
    }
    const response = await Author.create(req.body);
    res.redirect("/admin/author");
    // res.status(200).json({
    //   success: true,
    //   message: "Author added successfully",
    //   data: response,
    // });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    if (email) {
      const emailSearch = await Author.findOne({
        email,
        _id: { $ne: id },
      });
      if (emailSearch) {
        return res.redirect("/admin/author");
        // return res.status(400).json({
        //   success: false,
        //   message: "email already exist",
        // });
      }
    }
    const updateAuthor = await Author.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.redirect("/admin/author");
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    await Author.findByIdAndDelete(req.params.id);
    res.redirect("/admin/author");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getDetailAuthor, getListAuthor, getListAuthorJson, addAuthor, updateAuthor, deleteAuthor };