const mongoose = require('mongoose');
const db = mongoose.connection;

function connect(user, password) {
    var connectionString = `mongodb+srv://${user}:${password}@cluster0.ohorb.mongodb.net/Coco?retryWrites=true&w=majority`
    mongoose.connect(connectionString, {
        useNewURlParser: true,
        useUnifiedTopology: true
    });
}
function onConnect(callback){
    db.once("connected", () => {
        console.log("connected to mongodb");
    });
    db.once("connecting", ()=>{
        console.log("connecting to mongodb");
    });
    db.once("open", ()=>{
        console.log("mongodb connection open");
        callback();
    });
    db.once("error", ()=>{
        console.log("error connecting to mongodb");
    });
}
module.exports = {
    connect: connect,
    onConnect: onConnect
}