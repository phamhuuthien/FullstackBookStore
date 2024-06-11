
const Book = require("../model/book");
const User = require("../model/user");
const Order = require("../model/order");

exports.addRatingUI = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { content, stars } = req.body;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.render('Pages/book-detail', {
                book: book,
                error: "Sách không tồn tại"
            });
        }

        if(content == ""){
            return res.render('Pages/book-detail', {
                book: book,
                error: "Bạn chưa nhập nội dung"
            });
        }

        const userOrders = await Order.find({ userId: userId });
        let hasPurchased = false;

        userOrders.forEach(order => {
            order.listBooks.forEach(item => {
                if (item.bookId.toString() === bookId) {
                    hasPurchased = true;
                }
            });
        });

        if (!hasPurchased) {
            return res.render('Pages/book-detail', {
                book: book,
                error: "Bạn chưa mua quyển sách này!"
            });
        }

        const user = await User.findById(userId);
        const userName = user.lastname;

        const newRating = {
            orderId: userOrders.find(order => order.listBooks.some(item => item.bookId.toString() === bookId))._id,
            userName: userName,
            rating: {
                content: content,
                stars: stars
            }
        };

        book.ratings.push(newRating);

        await book.save();
        res.render('Pages/book-detail', { book });
    } catch (error) {
        console.error("Lỗi:", error);
        return res.render('Pages/book-detail', {
            book: {},
            error: "Đã xảy ra lỗi"
        });
    }
};


exports.updateRatingUI = async (req, res) => {
    try {
        const { bookId, ratingId } = req.params;
        const { content, stars } = req.body;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Sách không tồn tại" });
        }

        const ratingIndex = book.ratings.findIndex(rating => rating._id.toString() === ratingId);
        if (ratingIndex === -1) {
            return res.status(404).json({ success: false, message: "Đánh giá không tồn tại" });
        }

        const user = await User.findById(userId);
        const userName = user.lastname;

        if (book.ratings[ratingIndex].userName !== userName) {
            return res.status(403).json({ success: false, message: "Bạn không được phép sửa phần đánh giá này" });
        }

        book.ratings[ratingIndex].rating.content = content;
        book.ratings[ratingIndex].rating.stars = stars;

        await book.save();

        res.status(200).json({
            success: true,
            message: "Đã cập nhật đánh giá thành công.",
            book: book
        });
    } catch (error) {
        console.error("Error updating rating in book:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};


exports.deleteRatingUI = async (req, res) => {
    try {
        const { bookId, ratingId } = req.params;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.render('Pages/book-detail', {
                book: {},
                error: "Sách không tồn tại"
            });
        }

        const ratingIndex = book.ratings.findIndex(rating => rating._id.toString() === ratingId);
        if (ratingIndex === -1) {
            return res.render('Pages/book-detail', {
                book: book,
                error: "Đánh giá không tồn tại"
            });
        }

        const user = await User.findById(userId);
        const userName = user.lastname;

        if (book.ratings[ratingIndex].userName !== userName) {
            return res.render('Pages/book-detail', {
                book: book,
                error: "Bạn không được xóa đánh giá của người này!"
            });
        }

        book.ratings.splice(ratingIndex, 1);
        await book.save();

        res.render('Pages/book-detail', {
            book: book,
            success: "Đã xóa đánh giá thành công!"
        });
    } catch (error) {
        console.error("Error deleting rating from book:", error);
        return res.render('Pages/book-detail', {
            book: {},
            error: "Something went wrong"
        });
    }
};
