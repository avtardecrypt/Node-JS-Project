const express=require("express");
const blog= require("../Controllers/blogController");
const user=require("../Controllers/userController");
const router=express.Router();
router.route("/").get(blog.getAllBlogs).post(user.protect,blog.createblog);
router.route("/search").get(blog.searchProduct);
router.route("/:id").get(blog.getBlog).patch(user.protect,user.restrict('admin'),blog.updateBlog).delete(user.protect,user.restrict,blog.deleteBlog);
module.exports=router;