const mongoose=require("mongoose");
const User=require("../Models/userModel")
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Pls enter your title"],
        unique:[true,"Title should be unique"]
 
    },
    subtitle:{
        type:String,
        required:[true,"Pls enter your subtitle"]
    },
    description:{
        type:String,
        required:[true,"Pls enter your description"]
    },
    duration:{
        type:Number,
        required:[true,"Pls enter the duration"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})
const Blog=mongoose.model('Blog',blogSchema);
module.exports=Blog;
