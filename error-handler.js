class ErrorHander extends Error
{
  constructor(message,statusCode) {
    super(message)
    this.statusCode = statusCode
    console.log(message)
    // Error.captureStackTrace(this, this.constructor)
    
  }
}
module.exports = ErrorHander