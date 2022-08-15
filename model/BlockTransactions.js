const db = require("../app/db")
const lodash = require('lodash');

exports.new = function(record){
    const Transaction = [
        'blockNumber',
        'from',
        'to',
        'value',
        'input',
        'transactionIndex',
        'nonce',
        'gasPrice',
        'gas'
    ]

    return lodash.pick(record, Transaction);
}

exports.getRecords=function(where, offset = 0, limit = 100){
    return db.knex('block_transactions')
        .where(where).orderBy('id', 'desc')
        .limit(limit).offset(offset)
}

exports.insert = function(data){
    return db.knex('block_transactions').insert(data);
}

exports.update=function(data, where){
    return db.knex('block_transactions').where(where).update(data);
}