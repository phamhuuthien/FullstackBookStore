
const Book = require("../model/book");
const User = require("../model/user");
const Order = require("../model/order");

exports.addRating = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { content, stars } = req.body;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
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
            return res.status(403).json({ success: false, message: "You have not purchased this book" });
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

        res.status(200).json({
            success: true,
            message: "Comment added to book successfully.",
            book: book
        });
    } catch (error) {
        console.error("Error adding comment to book:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.addRatingUI = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { content, stars } = req.body;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.render('Pages/book-detail', {
                book: book,
                error: "Book not found"
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
                error: "You have not purchased this book"
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
        console.error("Error adding comment to book:", error);
        return res.render('Pages/book-detail', {
            book: {},
            error: "Something went wrong"
        });
    }
};


exports.updateRating = async (req, res) => {
    try {
        const { bookId, ratingId } = req.params;
        const { content, stars } = req.body;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const ratingIndex = book.ratings.findIndex(rating => rating._id.toString() === ratingId);
        if (ratingIndex === -1) {
            return res.status(404).json({ success: false, message: "Rating not found" });
        }

        const user = await User.findById(userId);
        const userName = user.lastname;

        if (book.ratings[ratingIndex].userName !== userName) {
            return res.status(403).json({ success: false, message: "You are not allowed to update this rating" });
        }

        book.ratings[ratingIndex].rating.content = content;
        book.ratings[ratingIndex].rating.stars = stars;

        await book.save();

        res.status(200).json({
            success: true,
            message: "Rating updated successfully.",
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
                error: "Book not found"
            });
        }

        const ratingIndex = book.ratings.findIndex(rating => rating._id.toString() === ratingId);
        if (ratingIndex === -1) {
            return res.render('Pages/book-detail', {
                book: book,
                error: "Rating not found"
            });
        }

        const user = await User.findById(userId);
        const userName = user.lastname;

        if (book.ratings[ratingIndex].userName !== userName) {
            return res.render('Pages/book-detail', {
                book: book,
                error: "You are not allowed to delete this rating"
            });
        }

        book.ratings.splice(ratingIndex, 1);
        await book.save();

        res.render('Pages/book-detail', {
            book: book,
            success: "Rating deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting rating from book:", error);
        return res.render('Pages/book-detail', {
            book: {},
            error: "Something went wrong"
        });
    }
};


exports.deleteRating = async (req, res) => {
    try {
        const { bookId, ratingId } = req.params;
        const userId = req.user._id;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }


        const ratingIndex = book.ratings.findIndex(rating => rating._id.toString() === ratingId);
        if (ratingIndex === -1) {
            return res.status(404).json({ success: false, message: "Rating not found" });
        }

        const user = await User.findById(userId);
        const userName = user.lastname;

        if (book.ratings[ratingIndex].userName !== userName) {
            return res.status(403).json({ success: false, message: "You are not allowed to delete this rating" });
        }


        book.ratings.splice(ratingIndex, 1);


        await book.save();

        res.status(200).json({
            success: true,
            message: "Rating deleted successfully.",
            book: book
        });
    } catch (error) {
        console.error("Error deleting rating from book:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};
