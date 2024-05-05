

const roleRouters = require("./roleRouter");
const userRouters = require("./userRouter");
const orderRouters = require("./orderRouter");
const couponRouters = require("./couponRouter");
const bookRouter = require("./bookRouter");

const initRouters = (app) => {
  app.use("/role", roleRouters);
  app.use("/user", userRouters);
  app.use("/order", orderRouters);
  app.use("/coupon", couponRouters);
  app.use("/books", bookRouter);
};

module.exports = initRouters;

