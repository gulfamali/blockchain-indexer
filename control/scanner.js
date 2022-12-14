const Scanner = require("../service/scanner");
const asyncHandler = require("../utils/async");
const Response = require("../utils/response");


exports.startscan = asyncHandler(async(req, res, next) => {
    Scanner.scanTransactions();
    Response(res, {http: 200});
});