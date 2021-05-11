const CronJob = require('cron').CronJob;
const { crawler } = require("../index.js");
new CronJob({
    cronTime: process.env.CRONJOB_TIME,//請編輯.env檔填上自己的爬蟲時段喔
    onTick: async function () {
        console.log(`開始執行爬蟲排程作業： ${new Date()}`);
        await crawler()
        console.log('排程作業執行完畢！');
    },
    start: true,
    timeZone: 'Asia/Taipei'
});
console.log('排程套件已啟用');