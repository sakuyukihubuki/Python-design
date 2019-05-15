const { ObjectID } = require("mongodb");

// create object id
function createObjectId() {
    let objectId = new ObjectID();
    return objectId.toHexString();
}

// create paperDetail
function createPaperDetail(id, quesArr) {
    return {
        "_id": id,
        "questions": quesArr.map((item, idx) => {
            return { ...item, idx, from: id }
        })
    };
}

// create paperList
function createPaperList(id, nameArr) {
    return nameArr.map(item => {
        return {
            "_id": id,
            "name": item
        }
    });
} 

module.exports = {
    createObjectId,
    createPaperDetail,
    createPaperList
}