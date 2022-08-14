const express = require("express");
const Scanner = require("../control/scanner");

const scanner = express.Router();

scanner.get("/start", Scanner.startscan);

module.exports = scanner;