const { MongoClient } = require("mongodb");

class MongodbHelper {
    constructor(url) {
        this.url = url || "mongodb://localhost:27017";
    }
    connect() {
        return new Promise((reslove, reject) => {
            MongoClient.connect(this.url).then((client) => {
                reslove(client);
            }).catch((err) => {
                reject(err);
            });
        }); 
    }
    collection(db, cName) {
        return new Promise((reslove, reject) => {
            this.isCollectionExisted(db, cName).then((flag) => {
                if(!flag){
                    this.createCollection(db, cName).then((collect) => {
                        reslove(collect);
                    }).catch((err) => {
                        reject(err);
                    });
                }else{
                    reslove(db.collection(cName));
                }
            });
        });
    }
    getCollection(db, cName) {
        return db.collection(cName);
    }
    createCollection(db, cName) {
        return db.createCollection(cName);
    }
    isCollectionExisted(db, cName) {
        return new Promise((reslove, reject) => {
            db.listCollections({name: "site1"}).next((err, value) => {
                if(err) {
                    reject(err);
                }
                if(value) {
                    reslove(true);
                }else {
                    reslove(false);
                }
            })
        });
    }
    deleteCollection(db, cName) {
        return db.collection(cName).drop();
    }
    connectCollection(db, left, right, newField) {
        return db.collection(left.name).aggregate([
            {
                $lookup: {
                    from: right.name,        
                    localField: left.filed, 
                    foreignField: right.filed,
                    as: newField
                }
            }
        ]);
    }
    insertDocument(collect, data) {
        if(data instanceof Array) {
            return collect.insertMany(data);
        }else if(typeof data === "object") {
            return collect.insertOne(data);
        }else {
            return Promise.reject(() => {
                throw "插入文档数据格式错误！";
            });
        } 
    }
    findDocument(collect, condition) {
        let findResult;
        if(!condition) {
            findResult = collect.find();   
        }else {
            findResult = collect.find(condition.where);
            if(condition.skip) {
                findResult = findResult.skip(condition.skip);
            }
            if(condition.limit) {
                findResult = findResult.limit(condition.limit);
            }
            if(condition.sort) {
                findResult = findResult.sort(condition.sort);
            }
        }
        return findResult;
    }
    updateDocument(collect, where, data) {
        if(!where) {
            return Promise.reject(() => {
                throw "没有设置更新文档的匹配条件";
            });
        }
        if(data instanceof Array) {
            return collect.updateMany(where, data);
        }else if(typeof data === "object") {
            return collect.updateOne(where, data);
        }else {
            return Promise.reject(() => {
                throw "更新文档数据格式错误！";
            });
        }
    }
    deleteDocument(collect, where, isMany) {
        if(where) {
            return Promise.reject(() => {
                throw "没有设置删除文档的匹配条件！";
            });
        }
        if(!isMany) {
            return collect.deleteOne(where);
        }else {
            return collect.deleteMany(where);
        }
    }
    aggregateDocument(collect, pipeline) {
        
        return collect.aggregate(pipeline);
    }
};

module.exports = MongodbHelper;