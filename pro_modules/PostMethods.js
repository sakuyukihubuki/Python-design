const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const common = require("./common");
const { exec } = require("child_process");
const fs = require("fs");
const { ObjectId } = require("mongodb");
const { promisify } = require("util")

const router = express.Router();

router.use(cookieParser());
router.use(session({
    secret: 'author myl',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        domain: 'localhost',
        httpOnly: true,
        secure: false,
        maxAge: (60*60*1000)
    }
}));

// discuss
router.post("/api/discuss/commit", (req, res) => {
    // id 
    let discussId = (new ObjectId()).toHexString();
    // username
    let username = req.session.username;
    // 注册时间
    let time = (new Date()).getTime();
    // paperId
    let paperId = req.body.paperId;
    // index
    let index = parseInt(req.body.index);
    // say
    let comment = req.body.comment;

    let obj = {
        paperId,
        index,
        discussId,
        star: 0,
        cai: 0,
        username,
        time,
        comment
    };
    
    let insertProimse = common.insertDocument("paper", "discuss", obj);
    insertProimse.then(() => {
        res.send(true);
    }).catch(() => {
        res.send(false);
    });
});

// star
router.post("/api/discuss/star", (req, res) => {
    let discussId = req.body.discussId;
    let updatePromise = common.updateDocument("paper", "discuss", { discussId }, { $inc: { star: 1 } })
    updatePromise.then(() => {
        res.send(true);
    }).catch(() => {
        res.send(false);
    });
});

// cai
router.post("/api/discuss/cai", (req, res) => {
    let discussId = req.body.discussId;
    let updatePromise = common.updateDocument("paper", "discuss", { discussId }, { $inc: { cai: 1 } })
    updatePromise.then(() => {
        res.send(true);
    }).catch(() => {
        res.send(false);
    });
});

// 运行代码
router.post("/api/code/run", (req, res) => {
    let username = req.session.username;
    let paperId = req.body.paperId;
    let index = req.body.index;
    let code = req.body.code;
    const read = promisify(fs.readFile);
    const write = promisify(fs.writeFile);
    const unitPromise = common.findDocumentToArray("paper", "testunits", { paperId, index });
    unitPromise.then((result) => {
        let unit = result.units[0];
        let input = unit.input;
        let output = unit.output;
        let writeStr = `input = ${input}\r\noutput = ${output}\r\n${code}\r\n`;
        read("code/run-template.py").then((data) => {
            data = data.toString()
            write(`tmpcode/code-${username}.py`, writeStr+data, (err) => {
                exec(`python tmpcode/code-${username}.py`, (err, stdout, stdin) => {
                    if(err) {
                        let reg  = /[\d\D]*(line\s\d*)[\d\D]*?(\w*(?:Error|Exception).*)/im;
                        let matchArr = reg.exec(err.message);
                        matchArr.shift();
                        res.send(matchArr.join(", "));
                    }else {
                        res.send(stdout);
                    }
                })
            });
        });
    });
});

// 提交代码
router.post("/api/code/commit", (req, res) => {
    let username = req.session.username;
    let paperId = req.body.paperId;
    let index = req.body.index;
    let code = req.body.code;
    const read = promisify(fs.readFile);
    const write = promisify(fs.writeFile);
    const unitPromise = common.findDocumentToArray("paper", "testunits", { paperId, index });
    unitPromise.then((result) => {
        let unit = result.units[0];
        let input = unit.input;
        let output = unit.output;
        let writeStr = `input = ${input}\r\noutput = ${output}\r\n${code}\r\n`;
        read("code/check-template.py").then((data) => {
            data = data.toString()
            write(`tmpcode/code-${username}.py`, writeStr+data, (err) => {
                exec(`python tmpcode/code-${username}.py`, (err, stdout, stdin) => {
                    if(err) {
                        let reg  = /[\d\D]*(line\s\d*)[\d\D]*?(\w*(?:Error|Exception).*)/im;
                        let matchArr = reg.exec(err.message);
                        matchArr.shift();
                        res.send(matchArr.join(", "));
                    }else {
                        res.send(stdout);
                    }
                })
            });
        });
    });
});

// 试卷答题提交
router.post("/api/commitPaper", (req, res) => {
    // 从session中获取用户名
    let username = req.session.username;
    // 获取试卷信息
    let paperId = req.body.paperId;
    // 如果可以出现用户没有填写题目的情况，不能跳过该题目答案，应将其置为undefined
    let answers = req.body.answers; 
    // $set
    let setObject = {};
    let answersField = "answers." + paperId;
    setObject[answersField] = JSON.parse(answers);
    // 将信息写入数据库
    try {
        common.updateDocument("paper", "answer", { username }, { $set: setObject });
        res.send({"result": true});
    }catch(err) {
        res.send({"result": false});
    }
});

// 类型答题提交
router.post("/api/commitAnswersByType", (req, res) => {
    // 从session中获取用户名
    let username = req.session.username;
    // 获取answers
    let answers = JSON.parse(req.body.answers);
    for (let i = 0; i < answers.length; i++) {
        let answer = answers[i];
        let paperId = answer.paperId;
        let index = answer.index;
        let value = answer.answer;
        // condition
        let condition = { username };
        condition["answers."+paperId+".index"] = index;
        let setObject = { };
        setObject["answers."+paperId+".$.answer"] = value;
        try {
            common.updateDocument("paper", "answer", condition, { $set: setObject });
        }catch(err) {
            res.send({ "result": true });
            break;
        }
    }
    res.send({ "result": true });
});


/*****************************

    backend-manager API

******************************/
// extend
router.post("/api/backend/deleteUser", (req, res) => {
    let username = req.body.username;
    let deletePromise = common.deleteDocument("paper", "user", { username }, false);
    deletePromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/addUser", (req, res) => {
    let obj = JSON.parse(req.body.obj);
    let insertPromise = common.insertDocument("paper", "user", obj);
    insertPromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/rewriteUser", (req, res) => {
    let obj = JSON.parse(req.body.obj);
    let updatePromise = common.updateDocument("paper", "user", { username: obj.username }, obj);
    updatePromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/deletePaper", (req, res) => {
    let _id = req.body.paperId;
    let deletePaperList = common.deleteDocument("paper", "paperList", { _id }, false);
    let deletePaperDetail = common.deleteDocument("paper", "paperDetail", { _id }, false);
    let promise = Promise.all([ deletePaperList, deletePaperDetail ]);
    promise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/addPaper", (req, res) => {
    let { list, detail } = JSON.parse(req.body.obj);
    let _id = dataCreator.createObjectId();
    list._id = _id;
    detail._id = _id;
    let insertPaperList = common.insertDocument("paper", "paperList", list);
    let insertPaperDetail = common.insertDocument("paper", "paperDetail", detail);
    let promise = Promise.all([ insertPaperList, insertPaperDetail ]);
    promise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/rewritePaper", (req, res) => {
    let { _id, list, detail } = JSON.parse(req.body.obj);
    let updatePaperList = common.updateDocument("paper", "paperList", { _id }, list);
    let updatePaperDetail = common.updateDocument("paper", "paperDetail", { _id }, detail);
    let promise = Promise.all([ updatePaperList, updatePaperDetail ]);
    promise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

module.exports =router;