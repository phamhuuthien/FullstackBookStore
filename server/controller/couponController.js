const Coupon = require('../model/coupon');

const getListCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getDetailCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.cid);
        res.status(200).json(coupon);
    } catch (err) {
        res.status(500).json(err);
    }
}

const addCoupon = async (req, res) => {
    try {
        const newCoupon = new Coupon({ code: req.body.code, discount: req.body.discount, expiry: req.body.expiry });
        const savedCoupon = await newCoupon.save();
        res.status(201).json(savedCoupon);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.cid);
        res.status(200).json("Coupon has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.cid);
        const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.cid, {
            $set: { code: req.body.code || coupon.code, discount: req.body.discount || coupon.discount, expiry: req.body.expiry || coupon.expiry }
        }, { new: true });
        res.status(200).json(updatedCoupon);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { getListCoupon, getDetailCoupon, addCoupon, deleteCoupon, updateCoupon };