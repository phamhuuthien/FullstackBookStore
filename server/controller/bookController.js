const Book = require("../model/book");
const Order = require('../model/order');
//upload file
const cloudinary = require("../configs/cloudinary");
const slugify = require('slugify');
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'BANK',
    allowedFormats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
});
const upload = multer({ storage: storage });

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        console.log(books); // Kiểm tra xem books có chứa dữ liệu không
        res.render('Pages/book-filter', { books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server Nội Bộ" });
    }
};

exports.getAllBooksByAdmin = async (req, res) => {
    try {
        const response = await Book.find();
        console.log(response); // Kiểm tra xem books có chứa dữ liệu không
        res.render('admin/book', { response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server Nội Bộ" });
    }
};

exports.getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id).populate(['authorId', 'categoryId']);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        res.render('Pages/book-detail', { book });
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

            const { name, description, price, quantity, categoryId, authorId } = req.body;

            if (!name || !description || !price || !quantity || !categoryId || !authorId) {
                return res.status(400).json({
                    success: false,
                    message: "Missing inputs",
                });
            }

            // Sinh ra slug từ tên sách
            const slug = slugify(name, {
                replacement: '-',  // Ký tự thay thế cho các khoảng trắng
                lower: true        // Chuyển đổi tất cả các ký tự sang chữ thường
            });

            const book = await Book.findOne({ slug });
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
                    categoryId,
                    authorId,
                    slug,  // Lưu slug vào trường slug của đối tượng sách
                    ratings: [] // Khởi tạo ratings là một mảng trống khi thêm sách mới
                });
                res.redirect("/admin/book");
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
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.searchBookByName = async (req, res) => {
    try {
        const { key } = req.query;

        const searchTerms = key.split(" ").filter(term => term.trim() !== "");
        const regexTerms = searchTerms.map(term => new RegExp(term, "i"));

        const books = await Book.find({
            $and: regexTerms.map(term => ({ name: { $regex: term } }))
        });

        if (books.length === 0) {
            return res.status(404).json({ success: false, message: "No books found matching the search criteria" });
        }
        res.render('Pages/book-filter', { books, key });
        // res.status(200).json({
        //     success: true,
        //     data: books
        // });

        // http://localhost:8000/search/see
        // http://localhost:8000/?search=see
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

