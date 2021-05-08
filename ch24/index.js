require('dotenv').config(); //載入.env環境檔
const { initDrive } = require("./tools/initDrive.js");
const { crawlerFB } = require("./tools/crawlerFB.js");
const { crawlerIG } = require("./tools/crawlerIG.js");
const { updateGoogleSheets } = require("./tools/google_sheets");
const { preCheck } = require("./tools/preCheck.js");
async function crawler () {
  if (!await preCheck()) {//先檢查基本設定
    return
  }

  const driver = await initDrive();
  if (!driver) {//driver不存在就結束程式
    return
  }
  //因為有些人是用FB帳號登入IG，為了避免增加FB登出的動作，所以採取先對IG進行爬蟲
  const ig_result_array = await crawlerIG(driver)
  const fb_result_array = await crawlerFB(driver)
  driver.quit();

  //處理Google Sheets相關動作
  await updateGoogleSheets(ig_result_array, fb_result_array)
}
crawler()