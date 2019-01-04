const { ObjectID } = require("mongodb");
const paperList = require("./paperList.json");
const paperDetail = require("./paperDetail.json");
const fs = require("fs");

// add object id
function addObjectId() {
    let objectId = new ObjectID();
    return objectId.toHexString();
}

// add paperList
function addPaperList(id, name) {
    paperList.push({
        "_id": id,
        "name": name
    });
}

// add paperDetail
function addPaperDetail(id, ques) {
    paperDetail.push({
        "_id": id,
        "question": ques
    });
}

// add paperQuestion
function addPaperQuestion(questions, obj) {
    questions.push(obj);
}

// parser
function parser() {
    let id = addObjectId();
    console.log(id)
}

parser();