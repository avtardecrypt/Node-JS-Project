const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const user=require("./Routes/userRoute");
const router=require("./Routes/blogRoute")
dotenv.config();
let app=express();
app.use(express.json());

app.use("/api/",user);
app.use("/api/posts",router);
mongoose.connect(process.env.CONNSTR,{
}).then((conn)=>{
    console.log("DB CONNECTED");
}).catch((error)=>{
    console.log("ERROR");
});
const port=process.env.PORT || 6842;
app.listen(port,()=>{
    console.log("running on port 6842");
})