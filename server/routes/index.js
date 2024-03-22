const roleRouters = require("./roleRouter");
const userRouters = require("./userRouter");

const initRouters = (app) => {
  app.use("/api/v1/role", roleRouters);
  app.use("/api/v1/user", userRouters);
};

module.exports = initRouters;
