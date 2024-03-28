const roleRouters = require('./roleRouter');
const bookRouter = require('./bookRouter'); // Import book router

const initRouters = (app) => {
    app.use("/api/v1/role", roleRouters);
    app.use("/api/v1/books", bookRouter); // Use book router
};

module.exports = initRouters;
