const ResponseHandler = require("./response");

const ExceptionHandler = (error, req, res, next) => {
  
  switch (error.name) {
    case "ValidationError":
      error.message = Object.values(err.errors).map(val => val.message);
      error.statusCode = 400;
      break;
  }

  console.log(`Exception Handler Triggered: ${new Date().toString()}`.white.bgRed)
  console.log(error.stack.red);
  
  ResponseHandler(res, {
    http: 500,
    message: 'Something went wrong while processing your request. Please try again.'
  })
};

module.exports = ExceptionHandler;