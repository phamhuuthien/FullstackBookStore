

const roleRouters = require("./roleRouter");
const userRouters = require("./userRouter");
const orderRouters = require("./orderRouter");
const couponRouters = require("./couponRouter");
const bookRouter = require("./bookRouter");
const authorRouters = require("./authorRouter");
const categoryRouters = require("./categoryRouter");

const initRouters = (app) => {
  app.use("/api/v1/role", roleRouters);
  app.use("/api/v1/user", userRouters);
  app.use("/api/v1/order", orderRouters);
  app.use("/api/v1/coupon", couponRouters);
  app.use("/api/v1/books", bookRouter);
  app.use("/api/v1/authors", authorRouters);
  app.use("/api/v1/categories", categoryRouters);
};

module.exports = initRouters;

