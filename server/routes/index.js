

const roleRouters = require("./roleRouter");
const userRouters = require("./userRouter");
const orderRouters = require("./orderRouter");
const couponRouters = require("./couponRouter");
const bookRouter = require("./bookRouter");
const commentRouter = require("./commentRouter");
const authorRouter = require("./authorRouter");
const categoryRouter = require("./categoryRouter")

const initRouters = (app) => {
  app.use("/role", roleRouters);
  app.use("/user", userRouters);
  app.use("/order", orderRouters);
  app.use("/coupon", couponRouters);
  app.use("/books", bookRouter);
  app.use("/comments", commentRouter);
  app.use("/author",authorRouter);
  app.use("/category",categoryRouter)
};

module.exports = initRouters;

