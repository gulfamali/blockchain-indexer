const Blocks = require('../model/Blocks');
const BlockTrans = require('../model/BlockTransactions');
const Ether  = require('../utils/ether');

const ScanTime = parseInt(process.env.SCAN_TIME)*60*1000;

exports.scanBlocks=async()=>{
    let startStamp = new Date().getTime();
    const lastBlock = await Blocks.getTopBlockHeight();
    if(lastBlock){
        let blockNumber = lastBlock.height;
        let proceed = true;

        console.log(`Last Block: ${blockNumber}`.yellow);

        while(proceed){
            blockNumber++;
            const check = await this.storeBlock(blockNumber);
            if(check){
                console.log(`Block ${blockNumber} inserted.`.green)
            } else {
                console.log(`Blockchain end reached or indexing failed.`.bgGreen.white);
                proceed = false;
            }

            if(new Date().getTime() - startStamp > ScanTime){
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
    let startStamp = new Date().getTime();
    let proceed = true;

    while(proceed){
        const transBatch = await BlockTrans.getRecords({scanComplete: 0}, 0, 50);

        if( transBatch?.length < 1 || (new Date().getTime() - startStamp > ScanTime) ){
            console.log(`All transactions are indexed.`.bgGreen.white);
            proceed = false;
        }
        else{
            for (let i=0; i < transBatch.length; i++){
                const trans = transBatch[i];
                const check = await this.storeTransactions(trans.hash);
                
                console.log(`Trans updation: ${check ? 'success'.green: 'fail'.red}`);

                if(!check){
                    proceed = false;
                    console.log('Exiting scanner...'.yellow);
                    break;
                }
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