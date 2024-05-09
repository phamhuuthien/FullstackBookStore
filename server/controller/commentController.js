const Comment = require("../model/comment");
const mongoose = require("mongoose");

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.addComment = async (req, res) => {
    try {
        // Lấy thông tin user từ token đã được trích xuất trong middleware verifyToken
        const currentUser = req.user;
        const { content } = req.body;
        const bookId = req.params.bookId; // Lấy bookId từ route params

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Missing inputs",
            });
        }

        // Chuyển bookId thành một ObjectId
        const validBookId = mongoose.Types.ObjectId.isValid(bookId);
        if (!validBookId) {
            return res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
        }

        // Tạo một bình luận mới với thông tin user từ token và bookId từ route params
        const newComment = await Comment.create({
            user: currentUser._id, // Sử dụng _id của user từ token
            book: mongoose.Types.ObjectId.createFromHexString(bookId), // Chuyển bookId thành ObjectId
            content
        });

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};


exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user; // Lấy thông tin user từ token đã được trích xuất trong middleware verifyToken
    const data = req.body;

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Kiểm tra xem người đăng nhập có phải là tác giả của comment hay không
        if (comment.user.toString() !== currentUser._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this comment" });
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, data, { new: true });
        if (!updatedComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        res.status(200).json({
            success: true,
            data: updatedComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    const currentUser = req.user; // Lấy thông tin user từ token đã được trích xuất trong middleware verifyToken
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Kiểm tra xem người đăng nhập có phải là tác giả của comment hay không
        if (comment.user.toString() !== currentUser._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
        }

        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getCommentsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const comments = await Comment.find({ book: bookId }).select('user content date');
        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

