let express = require("express");
let bodyParser = require("body-parser");
let MgHelper = require("./pro_modules/MongodbHelper");

let API =  {
    init() {
        let app = express();
        this.app = app;
        app.use(express.static('public'));
        this.urlencodedParser = bodyParser.urlencoded({ extended: false });
        return this;
    },
    listen(port, callback) {
        this.server = this.app.listen(port, callback);
    },
    getMethod(url, callback) {
        this.app.get(url, callback);
    },
    postMethod(url, callback) {
        this.app.post(url, this.urlencodedParser, callback);
    },
    initMethods(type, methodInfoArr) {
        let method = this[type + "Method"].bind(this);
        for(let i = 0; i < methodInfoArr.length; i++) {
            let curMethod = methodInfoArr[i];
            let url = curMethod.url;
            let handler = curMethod.handler;
            method(url, handler);
        }
    }
}

let getMethods = [
    {
        url: "/",
        handler: (req, res) => {
            res.render(__dirname + "\\public\\index");
        }
    }
];

let postMethods = [

];

API.init().listen(80, () => {
    // init get method
    API.initMethods("get", getMethods);
    // init post method
    API.initMethods("post", postMethods);
});