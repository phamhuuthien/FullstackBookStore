

const roleRouters = require("./roleRouter");
const userRouters = require("./userRouter");
const orderRouters = require("./orderRouter");
const couponRouters = require("./couponRouter");
const bookRouter = require("./bookRouter");
const getViewRouter = require("./getViewRouter");
const authorRouter = require("./authorRouter");
const categoryRouter = require("./categoryRouter")
const ratingRouter = require("./ratingRouter");

const initRouters = (app) => {
  app.use("/api/v1/role", roleRouters);
  app.use("/api/v1/user", userRouters);
  app.use("/api/v1/order", orderRouters);
  app.use("/api/v1/coupon", couponRouters);
  app.use("/api/v1/book", bookRouter);
  app.use("/api/v1/rating", ratingRouter);
  app.use("/api/v1/author", authorRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("", getViewRouter);
};

module.exports = initRouters;

