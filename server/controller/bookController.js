const mongoose = require('mongoose');
const Book = require("../model/book");
const Category = require("../model/category")
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
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 8; 

        // Tính toán số lượng sách cần bỏ qua để lấy trang hiện tại
        const skip = (page - 1) * limit;

        const totalBooks = await Book.countDocuments();

        const books = await Book.find().skip(skip).limit(limit);
        const categories = await Category.find();
        // Tính toán số lượng trang
        const totalPages = Math.ceil(totalBooks / limit);

        const categoryId = "";
        res.render('Pages/book-filter', {
            books,
            categories,
            currentPage: page,
            totalPages,
            totalBooks,
            categoryId,
            limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server Nội Bộ" });
    }
};

exports.getAllBooksByAdmin = async (req, res) => {
    try {
        const response = (await Book.find()).reverse();
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

            const slug = slugify(name, {
                replacement: '-', 
                lower: true   
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
                    slug,  
                    ratings: [] 
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
        res.redirect("/admin/book");
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
        res.redirect("/admin/book");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getBooksByIdCategory = async (req, res) => {
    try {
        const { categoryId } = req.query;
        console.log(categoryId)

        if (!categoryId || categoryId.trim() === "") {
            return res.status(400).json({ success: false, message: "Category ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 8; 
        const skip = (page - 1) * limit;

        const books = await Book.find({ categoryId }).skip(skip).limit(limit);
 
        const totalBooks = await Book.countDocuments({ categoryId: categoryId });

        if (totalBooks === 0) {
            const categories = await Category.find();
            return res.render('Pages/book-filter', {
                books: [],
                categories,
                key: "",
                categoryId, 
                currentPage: 1,
                totalPages: 1,
                totalBooks: 0,
                limit
            });
        }

        const totalPages = Math.ceil(totalBooks / limit);

        const categories = await Category.find();

        res.render('Pages/book-filter', {
            books,
            categories,
            key: "",
            categoryId, 
            currentPage: page,
            totalPages,
            totalBooks,
            limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.searchBookByName = async (req, res) => {
    try {
        const { key } = req.query;
        const categoryId = "";
        if (!key || key.trim() === "") {
            return res.status(400).json({ success: false, message: "Search key is required" });
        }

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 8; 
        const skip = (page - 1) * limit;

        const searchTerms = key.split(" ").filter(term => term.trim() !== "");
        const regexTerms = searchTerms.map(term => new RegExp(term, "i"));

        const totalBooks = await Book.countDocuments({
            $and: regexTerms.map(term => ({ name: { $regex: term } }))
        });
        const categories = await Category.find();
        if (totalBooks === 0) {
            return res.render('Pages/book-filter', {
                books: [],
                categories,
                key,
                currentPage: 1,
                totalPages: 1,
                totalBooks: 0,
                categoryId,
                limit
            });
        }

        const books = await Book.find({
            $and: regexTerms.map(term => ({ name: { $regex: term } }))
        }).skip(skip).limit(limit);

        const totalPages = Math.ceil(totalBooks / limit);

        res.render('Pages/book-filter', {
            books,
            categories,
            key,
            currentPage: page,
            totalPages,
            totalBooks,
            categoryId,
            limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};






