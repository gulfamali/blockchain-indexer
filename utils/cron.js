const CronJob = require('cron').CronJob;
const scannerService = require('../service/scanner');

const ScanTime = (parseInt(process.env.SCAN_TIME)+5);

function demoJobFn(){
    console.log(`every minute...`.yellow);
}

const demoJob = new CronJob(`0 * * * * *`, demoJobFn);
const blocksJob = new CronJob(`0 */${ScanTime} * * * *`, scannerService.scanBlocks);
const transJob = new CronJob(`0 */${ScanTime} * * * *`, scannerService.scanTransactions);

/** Cron Jobs Start & Stop */
exports.startJobs = function(){
    //demoJob.start();
    blocksJob.start();
    transJob.start()
}
