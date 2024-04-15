const Book = require("../model/book");
//upload file
const cloudinary = require("../configs/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'BANK',
  allowedFormats: ['jpg', 'png', 'jpeg'],
  transformation: [{ width: 500, height: 500, crop: 'limit'}],
});
const upload = multer({ storage: storage });

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
        upload.single('image')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                
                return res.status(500).json({
                    success: false,
                    message: "Error uploading image",
                    error: err.message
                });
            } else if (err) {
                
                return res.status(500).json({
                    success: false,
                    message: "Unexpected error uploading image",
                    error: err.message
                });
            }

            // Lấy URL của ảnh từ cloudinary
            const imageUrl = req.file.path; 

            const { name, description, price, quantity, totalLike, categoryId, authorId, slug } = req.body;

            if (!name || !description || !price || !quantity || !totalLike || !categoryId || !authorId || !slug) {
                return res.status(400).json({
                    success: false,
                    message: "Missing inputs",
                });
            }

            const book = await Book.findOne({ name });
            if (book) {
                return res.status(401).json({
                    success: false,
                    message: "Book already exists",
                });
            } else {
                const newBook = await Book.create({
                    name,
                    description,
                    image: imageUrl, 
                    price,
                    quantity,
                    totalLike,
                    categoryId,
                    authorId,
                    slug
                });
                return res.status(200).json({
                    success: true,
                    message: "Create book successfully.",
                    book: newBook
                });
            }
        });
    } catch (error) {
        console.error("Error adding book:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
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
        res.status(500).json({ message: "internal server Error" });
    }
};

exports.increaseLikeBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const updateBook = await Book.findByIdAndUpdate(bookId, { $inc: { totalLike: 1 } }, { new: true });
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
        const updateBook = await Book.findByIdAndUpdate(bookId, { $inc: { totalLike: -1 } }, { new: true });
        res.status(200).json({
            success: true,
            data: updateBook
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "update that bai" });
    }
}
