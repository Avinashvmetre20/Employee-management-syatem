const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const routes = require("./routes")
const rateLimit = require("express-rate-limit");

dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use(morgan("dev"))
app.use(helmet())
app.use(express.static("public"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

app.use("/api",routes)

app.use("/health",(req,res)=>{
    res.status(200).json({message:"healthy"})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    connectDB();
    console.log(`port is working on ${PORT}`)
})