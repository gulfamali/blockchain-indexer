const Scanner = require("../service/scanner");
const asyncHandler = require("../utils/async");
const Response = require("../utils/response");


exports.startscan = asyncHandler(async(req, res, next) => {
    await Scanner.scan();
    Response(res, {http: 200});
});