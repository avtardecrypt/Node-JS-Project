const User=require("../Models/userModel");
const asyncerrorhandler=require("../folder/asyncerrorhandler");
const cutomerror=require("../folder/customerror");
const jwt=require("jsonwebtoken");
const util=require("util");
const Blog=require("../Models/BlogModel");

const signtoken=id=>{
    return jwt.sign({id:id},process.env.SECRETSTR,{
        expiresIn:process.env.EXPIRES
    })
}
exports.signup=asyncerrorhandler(async(req,res,next)=>{
    const newuser=await User.create(req.body);
    res.status(201).json({
        status:"success",
        data:{
            user:newuser
        }
    })
})
exports.login=asyncerrorhandler(async(req,res,next)=>{
    const{email,password}=req.body;
    if(!email||!password){
        const error=new cutomerror("Pls provide email and password",400);
        return next(error);
    }
    const user=await User.findOne({email}).select('+password');
    if(!(await user.comparepassword(password,user.password))){
        const error=new cutomerror("Passwords do not match",400)
        return next(error)
    }
    const token=signtoken(user._id);
    res.status(201).json({
        status:"success",
        token,
        data:{
            user
        }
    })
})
exports.protect=asyncerrorhandler(async(req,res,next)=>{
    const testtoken=req.headers.authorization;
    let token;
    if(testtoken && testtoken.startsWith('Bearer')){
        token=testtoken.split(' ')[1];
    }
    if(!token){
        next(new cutomerror('Enter the token to login'),401);
    }
    const decodedtoken=await util.promisify(jwt.verify)(token,process.env.SECRETSTR);
    const user=await User.findById(decodedtoken.id);
    req.user=user;
    next();
});
exports.restrict=(role)=>{
    return(req,res,next)=>{   
        const blogid =  Blog.findById(req.params.id);
        const createdBy=blogid.createdBy;
         if (createdBy !== req.user._id && req.user.role !== role){
            const error=new CustomError("You dont have permission",403);
            next(error)
         }   
        next();
    }
}


