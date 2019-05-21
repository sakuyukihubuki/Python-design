const common = require('./common');
const express = require('express');
const path = require("path");

const router = express.Router();

// 登录页面
router.get("/denglu(.html)?", (req, res) => {
    res.header('Content-Type', 'text/html;charset=utf-8');
    res.sendFile(path.resolve(__dirname, "../public/denglu.html"));
});

// 注册页面
router.get("/zhuce(.html)?", (req, res) => {
    res.header('Content-Type', 'text/html;charset=utf-8');
    res.sendFile(path.resolve(__dirname, "../public/zhuce.html"));
});

// 登录
router.post("/api/login", (req, res) => {
    // 获取用户名和密码
    let username = req.body.username;
    let pwd = req.body.pwd;

    // 查找数据库
    let findPromise = common.findDocumentToArray("paper", "user", { where: {username, pwd} });
    findPromise.then((result) => {
        // 用户密码正确
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
    // let _id = objectId.toHexString();

    // 获取用户账号信息
    let username = req.body.username;
    let pwd = req.body.pwd;
    let email = req.body.email;
    let sex = req.body.sex;
    let birthday = req.body.birthday;
    
    // 注册时间
    let registerTime = (new Date()).getTime();

    // 获取用户基本信息

    // 验证
    if(!username) {
        res.send("0");
        return;
    }
    if(!pwd) {
        res.send("1");
        return;
    }
    // 查询用户名
    let findPromise = common.findDocumentToArray("paper", "user", { where: { username } });
    findPromise.then((result) => {
        if(!result.length) {
            // 存入数据库
            let promise = common.insertDocument("paper", "user", { username, pwd, email, sex, birthday, registerTime });
            promise.then(() => {
                res.send(true);
            }).catch(() => {
                res.send(false);
            }); 
        }else {
            res.send("2");
        }   
    });
});

module.exports = router;