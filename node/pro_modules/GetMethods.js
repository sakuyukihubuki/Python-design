const express = require("express");
const router = express.Router();
router.get("/test", (req, res, next) => {
    try {
        res.sendFile("../public/ddd.html");
    }catch(e) {
        next(500);
    }
})
// 获取试卷列表
router.get("/api/paperList", (req, res) => {
    
});

// 获取试卷题目
router.get("/api/paperDetail", (req, res) => {

});

// 获取专题题目
router.get("/api/questionByContent", (req, res) => {

});

// 按题目类别获取题目
router.get("/api/questionByType", (req, res) => {

})

module.exports = router;