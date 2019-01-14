const express = require("express");
const common = require("./common");
const { ObjectID } = require("mongodb");
const exec = require("child_process").exec;
const fs = require("fs");

const router = express.Router();
let objectId = new ObjectID();

// 登录
router.post("/api/login", (req, res) => {
    // 获取用户名和密码
    let username = req.body.username;
    let pwd = req.body.pwd;

    // 查找数据库
    let findPromise = common.findDocumentToArray("paper", "account", { username, pwd });
    findPromise.then((result) => {
        // 用户密码正确
        console.log(result)
        if(result.length) {
            req.session.username = username;
            res.send(true); 
        }else {
            res.send(false);
        }
    });
});

// 注册
router.post("/api/register", (req, res) => {
    // 生成ObjectId
    let _id = objectId.toHexString();

    // 获取用户账号信息
    let username = req.body.username;
    let pwd = req.body.pwd;
    
    // 获取用户基本信息

    // 验证
    if(!username) {
        res.send("用户名为空！");
    }
    if(!pwd) {
        res.send("密码为空！");
    }
    // 查询用户名
    let findPromise = common.findDocumentToArray("paper", "account", { where: { username } });
    findPromise.then((result) => {
        if(!result.length) {
            // 存入数据库
            let promise = common.insertDocument("paper", "account", { _id, username, pwd });
            promise.then(() => {
                res.send(true);
            }).catch(() => {
                res.send(false);
            }); 
        }else {
            res.send("用户名已存在");
        }   
    });
});

// 运行代码
router.post("/api/runcode", (req, res) => {
    let code = req.body.code;
    fs.writeFile("code/code.py", code+"\nprint(solution())", (err) => {
        let command = "python code/code.py";
        exec(command, (err, stdout, stdin) => {
            if(err){
                let reg  = /[\d\D]*(line\s\d*)[\d\D]*?(\w*(?:Error|Exception).*)/im;
                let matchArr = reg.exec(err.message);
                matchArr.shift();
                res.send(matchArr.join(", "));
            }
            else
                res.send(stdout);
        });
    });
});

// extend
router.post("/api/backend/addPaperList", (req, res) => {

});

module.exports =router;