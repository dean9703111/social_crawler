const schedule = require('node-schedule');
const { crawler } = require("../index.js");
const { checkEnv } = require("./preCheck.js");
try {
  checkEnv(['SCHEDULE_TIME']);
  console.log(`排程套件已啟用`);
  let is_crawler_run = false;//用來確認是否有爬蟲執行中
  schedule.scheduleJob(process.env.SCHEDULE_TIME, async function () {
    if (!is_crawler_run) {//同時間只允許一隻爬蟲運行
      is_crawler_run = true;
      console.log(`開始執行爬蟲排程作業： ${new Date()}`);
      await crawler();
      is_crawler_run = false;
      console.log('排程作業執行完畢！');
    }
  });
} catch (e) {
  console.error(e.message);
}