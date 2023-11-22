const Blog=require("../Models/BlogModel");
const user=require("../Controllers/userController");
const asyncerrorhandler=require("../folder/asyncerrorhandler");
const Filter = require('bad-words');
const filter = new Filter();
const customerror=require("../folder/customerror");

function containsOffensiveWord(phrase) {
  //  console.log("check: ", filter.isProfane(phrase))
  return filter.isProfane(phrase);
}


exports.createblog=asyncerrorhandler(async(req,res,next)=>{
   
   const{title,subtitle}=req.body;
   //console.log("reqBody:", req.body)
   
    if(!title || !title.trim() === ""){
        res.status(404).json({
            status:"error",
            message:"Title not found"
        })
    }
    if(!subtitle ){
        res.status(404).json({
            status:"error",
            message:"Enter the subtitle"
        })
    }
    if (containsOffensiveWord(title) || containsOffensiveWord(subtitle)  ) {
        res.status(500).json({
            status:"error",
            message:`${containsOffensiveWord(title) ? "Title" : "Subtitle"}  must not contain offensive or bad words`
        })
        const error=new customerror("must not contain offensive or bad words",400);
        return next(error);

    }
  
    req.body.createdBy = req.user._id
    const blog=await Blog.create(req.body);
   
    res.status(200).json({
        status: "success",
        data: {
            blog
        }
    });

   
})
exports.getAllBlogs=asyncerrorhandler(async(req,res,next)=>{
    let query = Blog.find();
    var search='';
    
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('duration');
    }
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 3;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
        const blogss = await Blog.countDocuments();
        if (skip >= blogss) {
            throw new Error("Page not found");
        }
    }
    const allbllogs = await query;
    res.status(200).json({
        status: "success",
        data: {
            blog: allbllogs
        }
    });
});
exports.getBlog=asyncerrorhandler(async(req,res,next)=>{
    const blog=await Blog.findById(req.params.id);
    if(!blog){
        const error=new customerror("Blog not found",401);
        return next(error)
    }
    res.status(200).json({
        status:'success',
        data:{
            blog
        }
    })
})
exports.updateBlog=asyncerrorhandler(async(req,res,next)=>{
    const updateBlog=await Blog.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!updateBlog){
        const error=new customerror("Blog not found",401);
        return next(error)
    }
    res.status(200).json({
        status:"success",
        data:{
            blog:updateBlog
        }
    });
});
exports.deleteBlog=asyncerrorhandler(async(req,res,next)=>{
    const deleteBlog=await Blog.findByIdAndDelete(req.params.id);
    console.log(req.body);
    if(!deleteBlog){
        const error=new customerror("Blog not found",401);
        return next(error)
    }
    res.status(200).json({
        status:"success",
        data:{
            blog:deleteBlog
        }
    });
});
exports.searchProduct=asyncerrorhandler(async(req,res,next)=>{
    var search=req.body.search;
    const blog=await Blog.find(
        {
            "$or":[
        { "title":{$regex:".*"+search+".*",$options:'i'}},
        { "subtitle":{$regex:".*"+search+".*",$options:'i'}},
        { "description":{$regex:".*"+search+".*",$options:'i'}}
            ]
         })
    if(blog.length>0){
        res.status(200).send({success:true,data:blog})
    }else{
        res.status(200).send({success:true,message:"No Blog Found"})
    }
})