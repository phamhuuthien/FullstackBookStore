

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

  app.use("/role", roleRouters);
  app.use("/user", userRouters);
  app.use("/order", orderRouters);
  app.use("/coupon", couponRouters);
  app.use("/book", bookRouter);
  app.use("/rating", ratingRouter);
  app.use("/author", authorRouter);
  app.use("/category", categoryRouter);
  app.use("", getViewRouter);
};

module.exports = initRouters;

