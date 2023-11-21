const mongoose=require("mongoose");
const User=require("../Models/userModel")
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    subtitle:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
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
