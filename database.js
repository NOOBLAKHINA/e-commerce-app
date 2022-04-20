const mongoose = require("mongoose")
const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI).then((data)=> {
    
    console.log(`mongo db connected with server: ${data.connection.host}`);
  }).catch((e)=>{console.log(e);}) 
  
}
module.exports= connectDB