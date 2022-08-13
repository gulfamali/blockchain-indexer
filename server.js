require("dotenv").config();
const { check } = require("./app/db");
check();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const ResponseHandler = require("./utils/response");
const ExceptionHandler = require("./utils/exception");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 50000 }));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

require("./routes/index")(app);
app.use(ExceptionHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold)
);

// Handle Unhandled Rejection
process.on("unhandledRejection", (error, promise) => {
  console.log(`Unhandled Rejection Error: ${error.message}`.red);
  server.close(() => process.exit(1));
});
