const db = require("../app/db")
const lodash = require('lodash');

exports.new = function(record){
    const Block = [
        'height',
        'timestamp',
        'size',
        'baseFeePerGas',
        'gasUsed',
        'gasLimit',
        'hash',
        'parentHash',
        'nonce',
        'difficulty',
        'totalDifficulty',
        'logsBloom',
        'extraData',
        'stateRoot',
        'miner',
        'mixHash',
        'receiptsRoot',
        'sha3Uncles',
        'transactionsRoot'
    ]

    record.height = record.number;
    delete record.number;

    return lodash.pick(record, Block);
}

exports.getTopBlockHeight = async function(){
    const record = await db.knex('blocks').select('height').orderBy('height', 'desc').limit(1);
    return record[0] || null;
}

exports.insert = function(data){
    return db.knex('blocks').insert(data);
}

exports.insertBlockTrans=async function(block){
    try{
        await db.knex.transaction(async trx => {

            const blockObj = this.new(block);
            blockObj.transactions = block.transactions.length;
            blockObj.burntFees = blockObj.baseFeePerGas*blockObj.gasUsed;

            await trx('blocks').insert(blockObj);

            if(block.transactions.length){
                const transRecords = block.transactions.map(el => {
                    return { hash: el }
                });
                await trx('block_transactions').insert(transRecords);
            }
        })
        return true;
    }
    catch(err){
        console.log(`Insertion failed: ${err.message}`.white.bgRed);
        console.log(`Trace: ${err.stack}`.red);
        return false;
    }
}