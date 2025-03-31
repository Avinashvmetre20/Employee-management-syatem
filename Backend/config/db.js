const mongoose = require("mongoose");
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`connected to ${conn.connection.host}`)
    }
    catch(err){
        console.log(`error ${err.message}`)
    }
}

module.exports = connectDB;