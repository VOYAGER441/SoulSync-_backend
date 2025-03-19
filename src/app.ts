import express from "express";
import routes from "./routes";
import cors from "cors";
import cron from 'node-cron'
import axios from 'axios';


const app=express();
app.use(cors());
app.use(express.json());



app.get("/",(_req,res)=>{
res.send("Hello World");
})

// use route for the soul
app.use("/soul",routes.SoulRouter);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

// Schedule the cron job to run every 30 minutes
cron.schedule('*/10 * * * *', async () => {
    try {
      const response = await axios.get('https://soulsync-backend.onrender.com');
      console.log(`✅ Success: ${response.status} - ${response.statusText}`);
    } catch (error:any) {
      console.error(`❌ Error: ${error.response ? error.response.status : error.message}`);
    }
  });