const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true,
        validate:{
            validator:function(val){
                return val==this.password;
            },
            message:"Password and confirm password doesn't match"
        }
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },

})
userSchema.pre('save',async function(next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,8);
    this.confirmpassword=undefined;
    next();
});
userSchema.methods.comparepassword=async function(pswd,pswddb){
    return await bcrypt.compare(pswd,pswddb);
}
const User=mongoose.model("User",userSchema);
module.exports=User