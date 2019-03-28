const path = require("path");
const fs = require("fs");

function notFoundHandler(basePath, public, page) {
    let publicPath = path.join(basePath, public);
    page = page || "404";
    page = page + ".html";
    return (req, res, next) => {
        let url = path.join(publicPath, req.originalUrl + ".html");
        if(!fs.existsSync(url)) {
            res.status("404");
            res.sendFile(path.join(publicPath, page));
        }else { 
            // to err handler
            next();
        }
    }
}

function errorHandler(basePath, public, page) {
    let publicPath = path.join(basePath, public);
    page = page || "error";
    page = page + ".html";
    return (req, res) => {
        res.status("500");
        res.sendFile(path.join(publicPath, page));
    };
}

function sessionHandler(basePath, public, page) {
    let publicPath = path.join(basePath, public);
    page = page || "login";
    page = page + ".html";
    return (req, res, next) => {
        if(req.session.username) {
            console.log(2)
            next();
        }else {
            res.sendFile(path.join(publicPath, page));
        }
    }
}

module.exports = {
    notFoundHandler,
    errorHandler,
    sessionHandler
}