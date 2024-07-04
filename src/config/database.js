const mongoose = require('mongoose')

const {ServerConfig} = require('./index')


const dbConnect = () => {

    mongoose.connect(ServerConfig.DB_URL,{
        useNewUrlParser: true,
        useNewTopology : true
    }
    .then( ()=>{
        console.log("db connected successfully")
    })
    .catch((error)=>{
        console.log("error occured during DB connection, DB connection failed")
        console.log(error)
        process.exit(1)
    })
)
}


module.exports = dbConnect