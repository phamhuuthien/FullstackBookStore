const mongoose = require('mongoose');
const Book = require("../model/book");
const Category = require("../model/category")
const User = require("../model/user")
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
        const allBook = await Book.find();
        const categories = await Category.find();
        // Tính toán số lượng trang
        const totalPages = Math.ceil(totalBooks / limit);

        const categoryId = "";
        const key = "";
        res.render('Pages/book-filter', {
            books,
            allBook,
            categories,
            currentPage: page,
            totalPages,
            totalBooks,
            categoryId,
            key,
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
            return res.status(404).json({ success: false, message: "Sách không tồn tại" });
        }

        res.render('Pages/book-detail', { book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server Nội Bộ" });
    }
};


exports.addBook = async (req, res) => {
    try {
        upload.single('image')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({
                    success: false,
                    message: "Lỗi tải ảnh",
                    error: err.message
                });
            } else if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Lỗi tải ảnh",
                    error: err.message
                });
            }

            // Lấy URL của ảnh từ cloudinary
            const imageUrl = req.file.path;

            const { name, description, price, quantity, categoryId, authorId } = req.body;
            const stars = 0;
            if (!name || !description || !price || !quantity || !categoryId || !authorId) {
                return res.status(400).json({
                    success: false,
                    message: "Thiếu fields đầu vào",
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
                    message: "Sách đã tồn tại",
                });
            } else {
                const newBook = await Book.create({
                    name,
                    description,
                    image: imageUrl,
                    price,
                    stars,
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
        console.error("Lỗi thêm sách:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi",
            error: error.message
        });
    }
};


exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ success: false, message: "Sách không tồn tại" });
        }
        res.redirect("/admin/book");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server Nội Bộ" });
    }
};

exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updatedBook = await Book.findByIdAndUpdate(id, data, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ success: false, message: "Sách không tồn tại" });
        }
        res.redirect("/admin/book");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi Server Nội Bộ" });
    }
};

exports.getBooksByIdCategory = async (req, res) => {
    try {
        const { categoryId } = req.query;
        console.log(categoryId)

        if (!categoryId) {
            return res.redirect('/book/book-filter');
        } 
        
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 8; 
        const skip = (page - 1) * limit;
        const allBook = await Book.find();
        const books = await Book.find({ categoryId }).skip(skip).limit(limit);
 
        const totalBooks = await Book.countDocuments({ categoryId: categoryId });

        if (totalBooks === 0) {
            const categories = await Category.find();
            return res.render('Pages/book-filter', {
                books: [],
                allBook,
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
            allBook,
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
        res.status(500).json({ message: "Lỗi Server Nội Bộ" });
    }
};

exports.searchBookByName = async (req, res) => {
    try {
        const { key } = req.query;
        const categoryId = "";
        if (!key || key.trim() === "") {
            return res.redirect('/book/book-filter');
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
        const allBook = await Book.find();
        if (totalBooks === 0) {
            return res.render('Pages/book-filter', {
                books: [],
                allBook,
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
            allBook,
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
        res.status(500).json({ message: "Lỗi Seerver nội bộ" });
    }
};






