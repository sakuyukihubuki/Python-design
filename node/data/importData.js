let dataCreator = require("../pro_modules/dataCreator");
let data = require("./paper.json");

// 生成detail
function createDetail(_id, paper) {
    var questions = [];
    paper.questions.forEach((el, idx) => {
        questions.push({
            _id,
            questions: { idx, ...el }
        });
    });
    return { _id, questions};
}

// 生成list
function createList(_id, paper) {
    return { _id, name: paper.name };
}

function main() {
    let paperList = [];
    let paperDetails = [];
    for(let i = 0; i < data.length; i++) {
        let curData = data[i];
        let _id = dataCreator.createObjectId();
        // 生成list
        let list = createList(_id, curData);
        paperList.push(list);
        // 生成detail
        let detail = createDetail(_id, curData);
        paperDetails.push(detail);
    }
    console.log(paperList, paperDetails);
}
main();
