const express = require("express");
const scanner = require("./scanner");
const blockchain = require("./blockchain");


module.exports = (app) => {
  app.use("/scanner", scanner);
  app.use("/blockchain", blockchain);
};