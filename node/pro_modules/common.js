const MongodbHelper = require("./MongodbHelper");

let m = new MongodbHelper();

// insert
function insertDocument(dbName, cName, data) {
    return new Promise((reslove, reject) => {
        let connectPromise = m.connect();
        connectPromise.then((client) => {
            let db = client.db(dbName);
            let collectPromise = m.collection(db, cName);
            collectPromise.then((collect) => {
                let insertPromise = m.insertDocument(collect, data);
                insertPromise.then(() => {
                    reslove();
                    client.close();
                });
            });
        });
    });
}

function findDocument(dbName, cName, condition) {
    return new Promise((reslove, reject) => {
        let connectPromise = m.connect(dbName);
        connectPromise.then((client) => {
            let db = client.db(dbName);
            let collect = db.collection(cName);
            let findResult = m.findDocument(collect, condition);
            reslove({client, findResult});
        });
    });
}

function countDocument(dbName, cName) {
    return new Promise((reslove, reject) => {
        let connectPromise = m.connect();
        connectPromise.then((client) => {
            let db = client.db(dbName);
            let collect = db.collection(cName);
            let countPromise = collect.countDocuments();
            countPromise.then((result) => {
                reslove(result);
                client.close();
            });
        });
    });
}

function findDocumentToArray(dbName, cName, condition) {
    return new Promise((reslove, reject) => {
        let findPromise = findDocument(dbName, cName, condition);
        findPromise.then(({ client, findResult }) => {
            let resultPromise = findResult.toArray();
            resultPromise.then((result) => {
                reslove(result);
                client.close();
            });
        });
    });
}

function aggregateDocumentToArray(dbName, cName, pipeline) {
    return new Promise((reslove, reject) => {
        let connectPromise = m.connect(dbName);
        connectPromise.then((client) => {
            let db = client.db(dbName);
            let collectPromise = m.collection(db, cName);
            collectPromise.then((collect) => {
                let aggCursor = m.aggregateDocument(collect, pipeline);
                let aggPromise = aggCursor.toArray();
                aggPromise.then((result) => {
                    reslove(result);
                });
            });
        });
    });
}

function updateDocument(dbName, cName, condition, updateStr) {
    return new Promise((reslove, reject) => {
        let connectPromise = m.connect(dbName);
        connectPromise.then((client) => {
            let db = client.db(dbName);
            let collectPromise = m.collection(db, cName);
            collectPromise.then((collect) => {
                // 更新
                m.updateDocument(condition, updateStr);
                reslove();
            });
        });
    });
}

module.exports = {
    insertDocument,
    findDocument,
    countDocument,
    findDocumentToArray,
    aggregateDocumentToArray,
    updateDocument
}