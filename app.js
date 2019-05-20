const express = require("express");
const session = require("express-session");
const chance = require("chance");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const middleware = require("./pro_modules/MiddleWare");
const getRouter = require("./pro_modules/GetMethods");
const postRouter = require("./pro_modules/PostMethods");
const pageTable = require("./pageReflectTable"); 
const publicRouter = require("./pro_modules/publicRouter");

let App =  {
    init() {
        let app = express();
        this.app = app;
        app.use(express.static('public'));
        //设置允许跨域访问该服务.
        app.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', '*');
            res.header('Content-Type', 'application/json;charset=utf-8');
            next();
        });
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(session({
            secret: chance().guid(),
            resave: true,
            saveUninitialized: true
        }));
        app.use(publicRouter);
		app.use("*", middleware.sessionHandler(__dirname, "public", 'denglu'));
        app.use(middleware.getPageReflectHandler(__dirname, "public", pageTable));
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