const express = require("express");
const blockchain = require("./blockchain");


module.exports = (app) => {
  app.use("/blockchain", blockchain);
};