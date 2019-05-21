const express = require("express");

const common = require("./common");

const router = express.Router();

// 获取试卷列表
router.get("/api/paperList", (req, res) => {
    // 获取请求信息
    let limit = parseInt(req.query.count);
    let page = parseInt(req.query.page);

    let skip = (page-1) * limit;

    // 查询数据库
    // count
    let countPromise = common.countDocument("paper", "paperDetail");

    // limit
    let findPromise = common.findDocumentToArray("paper", "paperDetail", { limit, skip });

    // all
    let allPromise = Promise.all([countPromise, findPromise]);
    allPromise.then((arr) => {
        let [ totalCount, result ] = arr;
        result.forEach((item, idx) => {
            result[idx] = {
                _id: item._id,
                name: item.name
            }
        })
        let totalPage = Math.ceil(totalCount / limit) || 1;
        res.send({ totalPage, result });
    });
});

// 获取试卷题目
router.get("/api/paperDetail", (req, res) => {
    // 获取试卷id
    let _id = req.query.paperId;
    // 查询数据库
    let findPromise = common.findDocumentToArray("paper", "paperDetail", { where: { _id } });

    findPromise.then((result) => {
        let json = result[0];
        res.send(json);
    });
});

// 按题目类别获取题目
router.get("/api/questionByType", (req, res) => {
    // 获取请求信息
    let type = req.query.type;
  
    let findPromise = common.aggregateDocumentToArray("paper", "paperDetail", [
        { $unwind: "$questions" }, 
        { $match: {"questions.type": type } },
        {
            $group: {
                _id: { type },
                totalCount: { $sum: 1 },
                questions: { $push: {questions: "$questions", _id: "$_id"} }
            }
        },
    ]);
    findPromise.then((arr) => {
        let result = arr[0];
        delete result._id;
        res.send(result)
    });
});

// 获取特定题目评论
router.get("/api/discussForQuestion", (req, res) => {
    function convert (result) {
       result.forEach(item => {
           delete item["paperId"];
           delete item["index"];
           return item
       })   
       return result
    }
    let paperId = req.query.paperId;
    let index = parseInt(req.query.index);
    let findPromise = common.findDocumentToArray("paper", "discuss", { where: { paperId, index } });
    findPromise.then(result => {
        res.send(convert(result));
    }).catch(() => {
        res.send(false);
    });
});

// 获取特定试卷评论（排序/未排序）
router.get("/api/discussForPaper", (req, res) => {
    const paperId = req.query.paperId;
    const isSort = req.query.isSort === 'true'
    const aggregatePromise = common.aggregateDocumentToArray("paper", "discuss", [
        { $match: { paperId } },
        {
            $group: {
                _id: paperId,
                totalCount: { $sum: 1 },
                result: { 
                    $push: { 
                        discussId: '$discussId', 
                        index: '$index', 
                        username: "$username", 
                        comment: "$comment",
                        time: "$time",
                        star: "$star", 
                        cai: "$cai" 
                    } 
                }
            }
        }
    ]);
    function convert(data) {
        const result = {}
        const arr = data.result
        arr.forEach(item => {
            let index = item.index
            let curIdxArr = result[index]
            if(curIdxArr) {
                curIdxArr.push(item)
            }else {
                result[index] = [ item ]
            }
        })
        data.result = result
        return data
    }
    aggregatePromise.then(result => {
        res.send(isSort ? convert(result[0]) : result[0])
    }).catch(() => {
        res.send(false)
    });
});

// 获取用户试卷答案



/***********************************

    backend-manager API

************************************/
router.get("/api/backend/adminList", (req, res) => {
    let findPromise = common.findDocumentToArray("paper", "admin")
    findPromise.then((result) => {
        res.send({ result })
    }).catch(() => {
        res.send({ result: false})
    });
});
router.get("/api/backend/paperList", (req, res) => {
    let findPromise = common.findDocumentToArray("paper", "paperList");
    findPromise.then((result) => {
        res.send({ result });
    }).catch(() => {
        res.send({ result: false });
    });
});
router.get("/api/backend/userList", (req, res) => {
    let findPromise = common.findDocumentToArray("paper", "user");
    findPromise.then((result) => {
        res.send({ result })
    }).catch(() => {
        res.send({ result: false })
    });
});

module.exports = router;