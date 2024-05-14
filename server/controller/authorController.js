const Author = require('../model/author');

const getDetailAuthor = async (req, res) => {
    try {
        const Author = await Author.findById(req.params.cid);
        res.status(200).json(Author);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getListAuthor = async (req, res) => {
    try {
        const author = await Author.find();
        res.status(200).json(author);
    } catch (err) {
        res.status(500).json(err);
    }
}

const addAuthor = async (req, res) => {
    try {
        const newAuthor = new Author(req.body);
        const saveAuthor = await newAuthor.save();
        res.status(200).json(saveAuthor);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateAuthor = async (req, res) => {
    try {
        const updateAuthor = await Author.findByIdAndUpdate(req.params.cid, {
            $set: req.body
        },
            {
                new: true
            });
        res.status(200).json(updateAuthor);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteAuthor = async (req, res) => {
    try {
        await Author.findByIdAndDelete(req.params.cid);
        res.status(200).json(" Author has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { getDetailAuthor, getListAuthor, addAuthor, updateAuthor, deleteAuthor };