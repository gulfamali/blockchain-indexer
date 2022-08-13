const express = require("express");
const ResponseHandler = require("../utils/response");

const blockchain = express.Router();

blockchain.get("/transactions", function(req, res, next){
    ResponseHandler(res, {http: 200, message: 'API works...'})
});

module.exports = blockchain;