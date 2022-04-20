// const { log } = require('console')
const app = require('./app')
const dotenv = require('dotenv')
const connectDB =  require('./db/database')
const cloudinary = require('cloudinary')
// .config({ path: 'backend/config/config.env' })
// config
// const PORT = PROCESS.env.PORT|| 5000
process.on('uncaughtException', (err) => {
  console.log(err.message);
  console.log('shutting down the server due to uncaught exception');
  process.exit(1)
})
// console.log(process)
// console.log(youtub);
dotenv.config({ path: 'backend/config/config.env' });
connectDB()
cloudinary.config(
  {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
)
const server = app.listen(process.env.PORT, () => {
  console.log(`server is listening at ${process.env.PORT}`);
})
// console.log(youtube);
// unhandled promise rejection
process.on('unhandledRejection', err => {
  console.log(`error: ${err.message}`);
  console.log(`Shutting down the serverdue to unhandled promise`);
  server.close(() => {
    process.exit(1)
  })
})
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
