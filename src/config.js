const mongoose = require("mongoose");
const url = "mongodb+srv://amayasi315:fgPbYENFKOQCW02K@amantha.ethwwnx.mongodb.net/?retryWrites=true&w=majority&appName=Amantha";

mongoose.set("strictQuery", true);
mongoose.connect(url,{ dbName: "TaskLoonsLab" })
.then(()=>{
    console.log("Database Connected Successfully");
}).catch((err)=>{
    console.log("Database cannot be Connected");
});

// Create Schema
const Loginschema = new mongoose.Schema({
    firstname: {
        type:String,
        required: true
    },
    lastname: {
        type:String,
        required: true
    },
    mobilenumber: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;