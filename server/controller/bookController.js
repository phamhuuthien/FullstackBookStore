const Book = require("../model/book");

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.addBook = async (req, res) => {
    try {
        const data = await Book.create(req.body);
        res.status(201).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updatedBook = await Book.findByIdAndUpdate(id, data, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        res.status(200).json({
            success: true,
            data: updatedBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getBooksByIdCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const books = await Book.find({ categoryId: categoryId });
        res.status(200).json({
            success: true,
            data: books
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "internal server Error"});
    }
};

exports.increaseLikeBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const updateBook = await Book.findByIdAndUpdate(bookId, { $inc: { totalLike: 1 } }, {new: true});
        res.status(200).json({
            success: true,
            data: updateBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "update that bai" });
    }
}

exports.decreaseLikeBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const updateBook = await Book.findByIdAndUpdate(bookId, { $inc: { totalLike: -1 } }, {new: true});
        res.status(200).json({
            success: true,
            data: updateBook
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "update that bai" });
    }
}
