const Blocks = require('../model/Blocks');
const Ether  = require('../utils/ether');

exports.scan=async()=>{
    const lastBlock = await Blocks.getTopBlockHeight();
    console.log(lastBlock)
    if(lastBlock){
        let blockNumber = lastBlock.height;
        let proceed = true;

        while(proceed){
            blockNumber++;
            console.log(`Block ${blockNumber}...`)
            const check = await this.storeBlock(blockNumber);
            if(!check){
                proceed = false;
            }
        }
    }
}

exports.storeBlock=async(blockNumber)=>{
    try{
        const block = await Ether.getBlock(blockNumber);
        if(block){
            const blockObj = Blocks.new(block);
            blockObj.transactions = block.transactions.length;
            blockObj.burntFees = blockObj.baseFeePerGas*blockObj.gasUsed;
            blockObj.scanDone = 1;
            await Blocks.insert(blockObj);
            console.log(`Block ${blockNumber} inserted.`)
            return true;
        }
        return false;
    }
    catch(err){
        console.log(`Block indexing failed: ${err.message}`.white.bgRed);
        console.log(`Trace: ${err.stack}`.red);
        return false;
    }
}

exports.storeTransactions=async()=>{
    try{
        const block = await Ether.getBlock(blockNumber);
        if(block){
            const blockObj = Blocks.new(block);
            blockObj.transactions = block.transactions.length;
            blockObj.burntFees = blockObj.baseFeePerGas*blockObj.gasUsed;
            blockObj.scanDone = 1;
            await Blocks.insert(blockObj);
            console.log(`Block ${blockNumber} inserted.`)
            return true;
        }
        return false;
    }
    catch(err){
        console.log(`Block indexing failed: ${err.message}`.white.bgRed);
        console.log(`Trace: ${err.stack}`.red);
        return false;
    }
}