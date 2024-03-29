

const roleRouters = require('./roleRouter')
const orderRouters = require('./orderRouter')
const couponRouters = require('./couponRouter')
const bookRouter = require('./bookRouter');


const initRouters = (app) => {
    app.use("/api/v1/role", roleRouters)
    app.use("/api/v1/order", orderRouters)
    app.use("/api/v1/coupon", couponRouters)
    app.use("/api/v1/books", bookRouter);
}

module.exports = initRouters;

