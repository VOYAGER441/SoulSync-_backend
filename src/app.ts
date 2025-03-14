import express from "express";
import routes from "./routes";

const app=express();



app.get("/",(_req,res)=>{
res.send("Hello World");
})

// use route for the soul
app.use("/soul",routes.SoulRouter);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})