const server = require('./server');
const mongo = require(`./data/mongo`);
const dotenv = require('dotenv')
dotenv.config();
const port = process.env.PORT || 8080;

mongo.onConnect(()=>{
    server.server.listen(port, ()=>{
        console.log(`server is running on port ${port}`);
    });
});

mongo.connect("codeschool", "codeschool");