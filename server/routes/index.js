
const roleRouters = require('./roleRouter')
const orderRouters = require('./orderRouter')
const couponRouters = require('./couponRouter')


const initRouters = (app) => {
    app.use("/api/v1/role", roleRouters)
    app.use("/api/v1/order", orderRouters)
    app.use("/api/v1/coupon", couponRouters)
}

module.exports = initRouters;