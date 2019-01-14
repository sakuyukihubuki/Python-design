const express = require("express");
const path = require("path");

const middleware = require("./MiddleWare");
const common = require("./common");

let pagePath = path.resolve(__dirname, "../public");

const router = express.Router();

router.get("/codemirror", (req, res) => {
    res.sendFile(path.join(pagePath, "codemirror-demo/index.html"));
})

router.get("/", (req, res) => {
    res.redirect("/index");
});

router.get("/index", (req, res) => {
    res.sendFile(path.join(pagePath, "index.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(pagePath, "login.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(pagePath, "register.html"));
});

// 检查登录会话是否存在
// router.get("*", middleware.sessionHandler(path.resolve(__dirname, ".."), "public"));

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
        res.send({ totalCount, result });
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

// 获取专题题目
// router.get("/api/questionByContent", (req, res) => {

// });

// 按题目类别获取题目
router.get("/api/questionByType", (req, res) => {
    // 获取请求信息
    let type = req.query.type;
    let limit = parseInt(req.query.count);
    let page = req.query.page;

    let skip = (page-1) * limit;
    console.log(skip)

    // 查询数据库
    // count
    // let countPromise = common.countDocument("paper", "paperDetail");

    // list
    let findPromise = common.aggregateDocument("paper", "paperDetail", [
        {
            $project: { 
                questions: { 
                    $filter: { 
                        input: "$questions",
                        as: "item",
                        cond: {
                            $eq: ["$$item.type", type]
                        }
                    }
                }
            }
        },
        // { $limit: limit },
        // { $skip: skip }
    ]);
    
    // let allPromise = Promise.all([countPromise, findPromise]);
    findPromise.then((result) => {
        let tmp = [];
        result.forEach((val, idx, arr) => {
            tmp = tmp.concat(val.questions);
        });
        let totalCount = tmp.length;
        tmp = tmp.slice(skip, skip+limit);
        res.send({ totalCount, result: tmp });
    });
});

module.exports = router;