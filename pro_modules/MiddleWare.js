const path = require("path");
const fs = require("fs");

function getPageReflectHandler(basePath, public, table) {
    let publicPath = path.join(basePath, public);
    return (req, res, next) => {
        let requestPath = req.originalUrl;
        let to = table[requestPath];
        let url = path.join(publicPath, req.originalUrl + ".html");
        if(to !== undefined) {
            res.header('Content-Type', 'text/html;charset=utf-8');
            let requestPage = path.join(publicPath, to + ".html");
            res.sendFile(requestPage);
        }else if(fs.existsSync(url)) {
            res.header('Content-Type', 'text/html;charset=utf-8');
            res.sendFile(url);
        }else {
            next();
        }
    };
}

function notFoundHandler(basePath, public, page) {
    let publicPath = path.join(basePath, public);
    page = page || "404";
    page = page + ".html";
    return (req, res, next) => {
        let url = path.join(publicPath, req.originalUrl + ".html");
        if(!fs.existsSync(url)) {
            res.header('Content-Type', 'text/html;charset=utf-8');
            res.status("404");
            res.sendFile(path.join(publicPath, page));
        }else { 
            next();
        }
    };
}

function errorHandler(basePath, public, page) {
    let publicPath = path.join(basePath, public);
    page = page || "error";
    page = page + ".html";
    return (req, res) => {
        res.header('Content-Type', 'text/html;charset=utf-8');
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
            next();
        }else {
            res.header('Content-Type', 'text/html;charset=utf-8');
            res.sendFile(path.join(publicPath, page));
        }
    };
}

module.exports = {
    getPageReflectHandler,
    notFoundHandler,
    errorHandler,
    sessionHandler
};