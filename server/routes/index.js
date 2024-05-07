

const roleRouters = require("./roleRouter");
const userRouters = require("./userRouter");
const orderRouters = require("./orderRouter");
const couponRouters = require("./couponRouter");
const bookRouter = require("./bookRouter");
const commentRouter = require("./commentRouter");
const getViewRouter = require("./getViewRouter");

const initRouters = (app) => {
  app.use("/role", roleRouters);
  app.use("/user", userRouters);
  app.use("/order", orderRouters);
  app.use("/coupon", couponRouters);
  app.use("/books", bookRouter);
  app.use("/comments", commentRouter);

  app.use("", getViewRouter);
};

module.exports = initRouters;

