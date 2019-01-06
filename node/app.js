const express = require("express");
const session = require("express-session");
const chance = require("chance");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const middleware = require("./pro_modules/MiddleWare");
const getRouter = require("./pro_modules/GetMethods");
const postRouter = require("./pro_modules/PostMethods");

let App =  {
    init() {
        let app = express();
        this.app = app;
        // app.use(express.static('public'));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(session({
            secret: chance().guid(),
            resave: true,
            saveUninitialized: true
        }));
        app.use(getRouter);
        app.use(postRouter);
        app.use(middleware.notFoundHandler(__dirname, "public"));
        app.use(middleware.errorHandler(__dirname, "public"));
        return this;
    },
    listen(port, callback) {
        // let options = {
        //     key: fs.readFileSync("./ssl/server.pem", "utf8"),
        //     cert: fs.readFileSync("./ssl/cert.pem", "utf8"),
        // }
        this.server = this.app.listen(port, callback);
        // this.server = https.createServer(options, this.app);
        // this.server.listen(port, callback);
    }
}

module.exports = App;