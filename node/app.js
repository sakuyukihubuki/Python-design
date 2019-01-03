const express = require("express");
const bodyParser = require("body-parser");
const middleware = require("./pro_modules/MiddleWare");
const getRouter = require("./pro_modules/GetMethods");
const postRouter = require("./pro_modules/PostMethods");

let app =  {
    init() {
        let app = express();
        this.app = app;
        app.use(express.static('public'));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(getRouter);
        app.use(postRouter);
        app.use(middleware.notFoundHandler(__dirname, "public"));
        app.use(middleware.errorHandler(__dirname, "public"));
        return this;
    },
    listen(port, callback) {
        this.server = this.app.listen(port, callback);
    }
}

module.exports = app;