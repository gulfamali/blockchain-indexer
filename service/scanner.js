const Blocks = require('../model/Blocks');
const BlockTrans = require('../model/BlockTransactions');
const Ether  = require('../utils/ether');

const ScanTime = parseInt(process.env.SCAN_TIME)*60*1000;

exports.scanBlocks=async()=>{
    let startStamp = new Date().getTime();
    const lastBlock = await Blocks.getTopBlockHeight();

    console.log(`\n Blocks indexer started: ${new Date().toLocaleString()}`.yellow);

    if(lastBlock){
        let blockNumber = lastBlock.height;
        let proceed = true;

        console.log(`Last Block: ${blockNumber}`.yellow);

        while(proceed){
            blockNumber++;
            const check = await this.storeBlock(blockNumber);
            if(!check){
                console.log(`Blockchain end reached or indexing failed. Exiting scanner.`.bgGreen.white);
                proceed = false;
            }
            else{
                console.log(`Block ${blockNumber} inserted.`.green);
            }

            if(new Date().getTime() - startStamp > ScanTime){
                console.log(`Scanning time exceeded. Exiting scanner.`.bgGreen.white);
                proceed = false
            }
        }
    }
}

exports.storeBlock=async(blockNumber)=>{
    try{
        const block = await Ether.getBlock(blockNumber);
        if(block){
            return Blocks.insertBlockTrans(block);
        }
        return false;
    }
    catch(err){
        console.log(`Block indexing failed: ${err.message}`.white.bgRed);
        console.log(`Trace: ${err.stack}`.red);
        return false;
    }
}

exports.scanTransactions=async()=>{
    console.log(`\n Trans indexer started: ${new Date().toLocaleString()}`.yellow);

    const transBatch = await BlockTrans.getRecords({scanComplete: 0}, 0, 250);

    if( transBatch?.length < 1){
        console.log(`All transactions are indexed.`.bgGreen.white);
    }
    else{
        for (let i=0; i < transBatch.length; i++){
            const trans = transBatch[i];
            const check = await this.storeTransactions(trans.hash);

            if(!check){
                console.log(`Trans updation failed. Exiting scanner.`.red);
                break;
            }
        }
    }
}

exports.storeTransactions=async(transHash)=>{
    try{
        let check = false;
        const trans = await Ether.getTransaction(transHash);
        if(trans){
            const transObj = BlockTrans.new(trans);
            check = await BlockTrans.update(transObj, {hash: transHash});
        }
        const reciept = await Ether.getTransReceipt(transHash);
        if(reciept && check){
            check = await BlockTrans.update({
                status: reciept.status,
                contractAddress: reciept.contractAddress,
                cumulativeGasUsed: reciept.cumulativeGasUsed,
                gasUsed: reciept.gasUsed,
                scanComplete: 1
            }, {hash: transHash});
        }
        return check || false;
    }
    catch(err){
        console.log(`Transaction indexing failed: ${err.message}`.white.bgRed);
        console.log(`Trace: ${err.stack}`.red);
        return false;
    }
}