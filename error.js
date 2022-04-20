const ErrorHander = require('../utils/error-handler')
module.exports = (err,req,res,next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal server error'
  // wrong mongodb code
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid:${err.path}`
    err=new ErrorHander(message,400)
  }
  // Duplicate email id
  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`
    err=new ErrorHander(message,400)
  }
  // Wrong JWT Error
  if(err.name === "JsonWebTokenError"){
    const message = `json web token is invalid, try again`
    err=new ErrorHander(message,400)
  }
  // JWT expire error 
  if(err.name === "TokenExpiredError"){
    const message = `json web token is expired, try again`
    err=new ErrorHander(message,400)

  }
  res.status(err.statusCode).json({success:false,error:err.message })
}
