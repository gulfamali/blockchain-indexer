const Web3 = require("web3");
const web3 = new Web3(process.env.ETH_NODE);

exports.latestBlockNumber = () => {
    return web3.eth.getBlockNumber();
}

exports.getBlock=(blockNumber)=>{
    return web3.eth.getBlock(blockNumber);
}