const schedule = require('node-schedule');
const { crawler } = require("../index.js");
schedule.scheduleJob(process.env.CRONJOB_TIME, async function () {
  console.log(`開始執行爬蟲排程作業： ${new Date()}`);
  await crawler()
  console.log('排程作業執行完畢！');
});
console.log(`排程套件已啟用`);