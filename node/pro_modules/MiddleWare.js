const path = require("path");
const fs = require("fs");

function notFoundHandler(basePath, public, page) {
    let publicPath = path.join(basePath, public);
    page = page || "404";
    page = page + ".html";
    return (req, res, next) => {
        if(req === 500) {
            next();
        }
        let url = path.join(publicPath, req.originalUrl);
        if(!fs.existsSync(url)) {
            res.status("404");
            res.sendFile(path.join(publicPath, page));
        }else { 
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
        res.end();
    };
}



module.exports = {
    notFoundHandler,
    errorHandler
}