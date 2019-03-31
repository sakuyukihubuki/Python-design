const express = require("express");
const common = require("./common");
const { exec } = require("child_process");
const fs = require("fs");
const dataCreator = require("./dataCreator");

const router = express.Router();

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
            let promise = common.insertDocument("paper", "user", { username, pwd, answers: [] });
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

// 答题提交
router.post("/api/commitPaper", (req, res) => {
    // 从session中获取用户名
    let username = req.session.username;
    username = "password2";
    // 获取试卷信息
    let paperId = req.body.paperId;
    // 如果可以出现用户没有填写题目的情况，不能跳过该题目答案，应将其置为undefined
    let answers = req.body.answers; 
    // $set
    let setObject = {};
    let answersField = "anwsers." + paperId;
    setObject[answersField] = answers;
    // 将信息写入数据库
    common.updateDocument("paper", "user", { username }, { $set: setObject });
    res.send({"result": true});
});

// extend
router.post("/api/backend/addPaper", (req, res) => {
    let id = dataCreator.createObjectId();
    
});

module.exports =router;