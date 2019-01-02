const { MongoClient } = require("mongodb");

class MongodbHelper {
    constructor(url) {
        this.url = url || "mongodb://localhost:27017";
    }
    connect(dbName) {
        return new Promise((reslove, reject) => {
            MongoClient.connect(this.url).then((client) => {
                reslove(client.db(dbName));
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
        
        return db.collection(cName);
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
    delete() {

    }
    rewrite() {

    }
    search() {

    }
    sort() {

    }
};

module.exports = MongodbHelper;