require('dotenv').config(); // 載入.env環境檔

// 取出.env檔案填寫的FB資訊
const fb_username = process.env.FB_USERNAME;
const fb_userpass = process.env.FB_PASSWORD;

const webdriver = require('selenium-webdriver'), // 加入虛擬網頁套件
  By = webdriver.By, // 你想要透過什麼方式來抓取元件，通常使用xpath、css
  until = webdriver.until; // 直到抓到元件才進入下一步(可設定等待時間)
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
    const file_path = '../chromedriver.exe'; // '../chromedriver.exe'記得調整成自己的路徑
    console.log(path.join(__dirname, file_path)); // 請確認印出來日誌中的位置是否與你路徑相同
    if (fs.existsSync(path.join(__dirname, file_path))) { // 確認路徑下chromedriver.exe是否存在            
      const service = new chrome.ServiceBuilder(path.join(__dirname, file_path)).build(); // 設定driver路徑
      chrome.setDefaultService(service);
      console.log('設定driver路徑');
    } else {
      console.error('無法設定driver路徑');
      return false;
    }
  }
  return true;
}

async function loginFacebook () {
  if (!checkDriver()) {// 檢查driver是否設定，如果無法設定就結束程式
    return;
  }
  let driver;
  try {
    driver = await new webdriver.Builder().forBrowser("chrome").withCapabilities(options).build();
  } catch (e) {
    console.error('無法建立瀏覽器!');
    console.error(e);
    return;
  }
  const web = 'https://www.facebook.com/login'; // FB登入頁面
  await driver.get(web); // 在這裡要用await確保打開完網頁後才能繼續動作

  // 填入FB登入資訊
  const fb_email_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="email"]`))); // 找出填寫email的元件
  fb_email_ele.sendKeys(fb_username); // 將使用者的資訊填入
  const fb_pass_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="pass"]`)));
  fb_pass_ele.sendKeys(fb_userpass);

  // 抓到登入按鈕然後點擊
  const login_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginbutton"]`)));
  login_ele.click();
}
loginFacebook(); // 登入FB