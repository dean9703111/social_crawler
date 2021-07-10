require('dotenv').config(); //載入.env環境檔
const webdriver = require('selenium-webdriver'); // 加入虛擬網頁套件
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addArguments('--log-level=3'); // 這個option可以讓你跟網頁端的console.log說掰掰
const path = require('path'); // 用於處理文件路徑的小工具
const fs = require("fs"); // 讀取檔案用

function checkDriver () {
  try {
    chrome.getDefaultService(); // 確認是否有預設
  } catch {
    console.warn('找不到預設driver!');

    // '../chromedriver.exe'記得調整成自己的路徑
    const file_path = '../chromedriver.exe';
    // 請確認印出來日誌中的位置是否與你路徑相同
    console.log(path.join(__dirname, file_path));

    // 確認路徑下chromedriver.exe是否存在            
    if (fs.existsSync(path.join(__dirname, file_path))) {
      // 設定driver路徑
      const service = new chrome.ServiceBuilder(path.join(__dirname, file_path)).build();
      chrome.setDefaultService(service);
      console.log('設定driver路徑');
    } else {
      console.error('無法設定driver路徑');
      return false;
    }
  }
  return true;
}

async function openCrawlerWeb () {
  if (!checkDriver()) {// 檢查driver是否有設定，如果無法設定就結束程式
    return;
  }
  let driver;
  try {
    // 建立這個Browser的類型
    driver = await new webdriver.Builder().forBrowser("chrome").withCapabilities(options).build();
  } catch (e) {
    console.error('無法建立瀏覽器!');
    console.error(e);
    return;
  }
  const web = 'https://medium.com/dean-lin'; // 填寫你想要前往的網站
  driver.get(web); // 透過這個driver打開網頁
}
openCrawlerWeb(); // 打開爬蟲網頁