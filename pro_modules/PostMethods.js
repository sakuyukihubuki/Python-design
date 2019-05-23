const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const common = require("./common");
const child_process = require("child_process");
const fs = require("fs");
const { ObjectId } = require("mongodb");
const { promisify } = require("util")
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const exec = promisify(child_process.exec);

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

// rewriteUser
router.post("/api/rewriteUser", (req, res) => {
    let username = req.session.username;
    let body = req.body;

    let updatePromise = common.updateDocument("paper", "user", { username }, { $set: body });
    updatePromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    })
});

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
    // comment
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

// 运行一次代码的操作
function runCode (username, tpl, paperId, index, code, isSimple) {
    return new Promise(function(resolve, reject) {
        const unitPromise = common.findDocumentToArray("paper", "testunits", { where: { paperId, index } });
        unitPromise.then((result) => {
            result = result[0];
            let isMutiply = result.mutiply
            let writeStr;
            // 只检查一项
            if(isSimple) {
                let unit = result.units[0];
                let input = JSON.stringify(unit.input);
                let output = JSON.stringify(unit.output);
                writeStr = `input = ${input}\r\noutput = ${output}\r\n`;
            }else {
                let units = JSON.stringify(result.units)
                writeStr = `units = ${units}\r\n`
            }
            writeStr += `isMutiply = ${isMutiply}\r\n${code}\r\n`;
            read(tpl).then((data) => {
                data = data.toString()
                write(`tmpcode/code-${username}.py`, writeStr+data).then(() => {
                    exec(`python tmpcode/code-${username}.py`).then((out) => {
                        const result = out.stdout.split("!@#$%^&*()")
                        resolve(result);
                    }).catch(err => {
                        let reg  = /[\d\D]*line\s(\d*)[\d\D]*?(\w*(?:Error|Exception).*)/im;
                        let matchArr = reg.exec(err.message);
                        matchArr.shift();
                        matchArr[0] -= 3
                        reject(JSON.stringify(matchArr.join(", ")));
                    })
                }).catch(err => {
                    reject(err)
                });
            }).catch(err => {
                reject(err)
            });
        });
    });
}

// 运行代码（测试单个用例）
router.post("/api/code/run", (req, res) => {
    let username = req.session.username;
    let paperId = req.body.paperId;
    let index = parseInt(req.body.index);
    let code = req.body.code;
    runCode(username, "code/run-template.py", paperId, index, code, true).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    });
});

// 提交代码（测试所有用例）
router.post("/api/code/commit", (req, res) => {
    let username = req.session.username;
    let paperId = req.body.paperId;
    let index = parseInt(req.body.index);
    let code = req.body.code;
    runCode(username, "code/check-template.py", paperId, index, code, false).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    });
});

// 试卷答题提交
router.post("/api/commitPaper", (req, res) => {
    // 从session中获取用户名
    // let username = req.session.username;
    let username = "myl";
    // 获取试卷信息
    let paperId = req.body.paperId;
    // 如果可以出现用户没有填写题目的情况，不能跳过该题目答案，应将其置为undefined
    let answers = req.body.answers; 
    // $set
    let setObject = {};
    let answersField = "answers." + paperId;
    try{
        setObject[answersField] = JSON.parse(answers);
    }catch(err) {
        setObject[answersField] = answers;
    }
    // 为编程题添加一个运行情况字段（run_situation）
    setObject[answersField].forEach((item) => {
        if(item.index >= 40) {
            runCode(username, "code/check-template.py", paperId, item.index, item.answer, false).then((result) => {
                item.run_situation = JSON.parse(result);
            }).catch((err) => {
                item.run_situation = err;
            });
        }
    });
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
    function merge(target, source) {
        for(key in source) {
            if(target[key]) {
                // 如果target存在和source一样的index（同一题目），在target中删除
                target[key].forEach((item, idx) => {
                    if(source[key].some(value => value.index === item.index)) {
                        target[key].splice(idx, 1);
                    }
                });
                target[key] = target[key].concat(source[key]);
                target[key].sort((firstEl, sencodeEl) => {
                    return firstEl.index - sencodeEl.index;
                });
            }else {
                target[key] = source[key];
                target[key].sort((firstEl, sencodeEl) => {
                    return firstEl.index - sencodeEl.index;
                });
            }
        }
        return target;
    }
    // 从session中获取用户名
    let username = req.session.username;
    // 获取answers
    let answers;
    // 判断答题类型
    let isCode = answers[0].index >= 40;
    // 如果是编程题，添加一个运行后的字段run_situation
    if (isCode) {
        answers.forEach(item => {
            runCode(username, "code/check-template.py", paperId, item.index, item.answer, false).then((result) => {
                item.run_situation = JSON.parse(result);
            }).catch((err) => {
                item.run_situation = err;
            });
        });
    }
    try {
        answers = JSON.parse(req.body.answers);
    }catch(err) {
        answers = req.body.answers;
    }
    let formatAnwsers = {}
    for (let i = 0; i < answers.length; i++) {
        let answer = answers[i];
        let paperId = answer.paperId;
        let index = answer.index;
        let value = answer.answer;
        if (formatAnwsers[paperId]) {
            formatAnwsers[paperId].push({ index, answer: value });
        }else {
            formatAnwsers[paperId] = [ { index, answer: value } ];
        }
    } 
    let findPromise = common.findDocumentToArray("paper", "answer", { username });
    findPromise.then((result) => {
        let promise;
        // 用户有答题记录
        if(result.length > 0) {
            result = result[0];
            let answers = merge(result.answers, formatAnwsers);
            promise = common.updateDocument("paper", "answer", { username }, { answers });
        }
        // 用户没有答题记录
        else {
            promise = common.insertDocument("paper", "answer", {
                username,
                answers: formatAnwsers
            });
        }
        promise.then(() => {
            res.send({ result: true });
        }).catch(() => {
            res.send({ result: false });
        })
    })
});


/*****************************

    backend-manager API

******************************/
// extend
router.post("/api/backend/login", (req, res) => {
    let username = req.body.username;
    let pwd = req.body.pwd;
    let findPromise = common.findDocumentToArray("paper", "admin", { where: {username, pwd} });
    findPromise.then((data) => {
        req.session.username = data[0].username;
        res.send({ result: data[0], status: true });
    }).catch(() => {
        res.send({ result: false });
    })
});
router.post("/api/backend/addAdmin", (req, res) => {
    let username = req.body.username;
    let pwd = req.body.pwd;
    let type = req.body.type;
    let time = (new Date()).getTime()
    let insertPromise = common.insertDocument("paper", "admin", { username, pwd, type, time });
    insertPromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});
router.post("/api/backend/deleteAdmin", (req, res) => {
    let username = req.body.username;
    let deletePromise = common.deleteDocument("paper", "admin", { username }, false);
    deletePromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});
router.post("/api/backend/rewriteAdmin", (req, res) => {
    let username = req.body.username;
    let pwd = req.body.pwd;
    let updatePromise = common.updateDocument("paper", "admin", { username }, { $set: { pwd }});
    updatePromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});
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
    let insertPromise = common.insertDocument("paper", "user", req.body);
    insertPromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/rewriteUser", (req, res) => {
    let obj = req.body;
    delete obj._id
    let updatePromise = common.updateDocument("paper", "user", { username: obj.username }, { $set: obj });
    updatePromise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/deletePaper", (req, res) => {
    let _id = req.body.paperId;
    let deletePaperDetail = common.deleteDocument("paper", "paperDetail", { _id }, false);
    let promise = Promise.all([ deletePaperList, deletePaperDetail ]);
    promise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/addPaper", (req, res) => {
    let { selects, bases, synthesis, units } = req.body;
    let paperId = (new ObjectId()).toHexString();
    let paper = selects.concat(bases, [ synthesis ]);
    paper._id = paperId;
    let testunits = units.map((unit, idx) => {
        let isMutiply = unit.input && unit.input.length > 2
        return {
            paperId,
            index: idx + 40,
            isMutiply,
            units: unit
        }
    })
    let insertPaperDetail = common.insertDocument("paper", "paperDetail", paper);
    let insertTestUnits = common.insertDocument("paper", "testunits", testunits);
    let promise = Promise.all([insertPaperDetail, insertTestUnits]);
    promise.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

router.post("/api/backend/rewritePaper", (req, res) => {
    let paper = JSON.parse(req.body.paper);
    let updatePaperDetail = common.updateDocument("paper", "paperDetail", { _id }, paper);
    updatePaperDetail.then(() => {
        res.send({ result: true });
    }).catch(() => {
        res.send({ result: false });
    });
});

module.exports =router;