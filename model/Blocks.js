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