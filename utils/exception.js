const ResponseHandler = require("./response");

const ExceptionHandler = (err, req, res, next) => {
  let error = { ...err };
  
  switch (error.name) {
    case "ValidationError":
      error.message = Object.values(err.errors).map(val => val.message);
      error.statusCode = 400;
      break;
  }

  console.log(`Exception: ${error.message}`.red)
  console.log(error.stackTrace);
  
  ResponseHandler(res, {
    http: 500,
    message: 'Something went wrong while processing your request. Please try again.'
  })
};

module.exports = ExceptionHandler;