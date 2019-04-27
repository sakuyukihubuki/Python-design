const express = require("express");
const path = require("path");

const middleware = require("./MiddleWare");
const common = require("./common");

let pagePath = path.resolve(__dirname, "../public");

const router = express.Router();

// test
router.get("/codemirror", (req, res) => {
    res.sendFile(path.join(pagePath, "codemirror-demo/index.html"));
});

router.get("/", (req, res) => {
    res.redirect("/index");
});

router.get("/index", (req, res) => {
    res.sendFile(path.join(pagePath, "homepage.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(pagePath, "login.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(pagePath, "register.html"));
});

/***********************************

    backend-manager API

************************************/
router.get("/api/backend/paperList", (req, res) => {
    let findPromise = common.findDocumentToArray("paper", "paperList");
    findPromise.then((arr) => {
        res.send({ result: arr, state: true });
    }).catch(() => {
        res.send({ result: null, state: false });
    });
});

router.get("/api/backend/userList", (req, res) => {
    let findPromise = common.findDocumentToArray("paper", "user");
    findPromise.then((arr) => {
        res.send({ result: arr, state: true })
    }).catch(() => {
        res.send({ result: null, state: false })
    });
});

// 检查登录会话是否存在
router.get("*", middleware.sessionHandler(path.resolve(__dirname, ".."), "public"));

// 获取试卷列表
router.get("/api/paperList", (req, res) => {
    // 获取请求信息
    let limit = parseInt(req.query.count);
    let page = parseInt(req.query.page);

    let skip = (page-1) * limit;

    // 查询数据库
    // count
    let countPromise = common.countDocument("paper", "paperList");

    // limit
    let findPromise = common.findDocumentToArray("paper", "paperList", { limit, skip });

    // all
    let allPromise = Promise.all([countPromise, findPromise]);
    allPromise.then((arr) => {
        let [ totalCount, result ] = arr;
        let totalPage = Math.ceil(totalCount / limit) || 1;
        res.send({ totalPage, result });
    });
});

// 获取试卷题目
router.get("/api/paperDetail", (req, res) => {
    // 获取试卷id
    let _id = req.query.paperId;
    
    // 查询数据库
    let findPromise = common.findDocumentToArray("paper", "paperDetail", { _id });

    findPromise.then((result) => {
        let json = result[0];
        res.send(json);
    });
});

// 按题目类别获取题目
router.get("/api/questionByType", (req, res) => {
    // 获取请求信息
    let type = req.query.type;
    let limit = parseInt(req.query.count);
    let page = req.query.page;

    let skip = (page-1) * limit;
  
    let findPromise = common.aggregateDocumentToArray("paper", "paperDetail", [
        { $unwind: "$questions" }, 
        { $match: {"questions.type": type } },
        {
            $group: {
                _id: { type },
                totalCount: { $sum: 1 },
                result: { $push: {questions: "$questions", _id: "$_id"} }
            }
        },
        { $skip: skip },
        { $limit: limit }
    ]);
    findPromise.then((arr) => {
        let result = arr[0];
        result.totalPage = Math.ceil(result.totalCount/limit);
        delete result._id;
        delete result.totalCount;
        let ques = result.result;
        for(let i = 0; i < ques.length; i++) {
            let curQues = ques[i];
            ques[i] = { _id: curQues._id, ...curQues.questions };
        }
        res.send(result)
    });
});

module.exports = router;