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
// 因為notifications會干擾到爬蟲，所以要先把它關閉
options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });

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

async function loginFacebookGetTrace () {
  let driver;
  if (!checkDriver()) {// 檢查driver是否設定，如果無法設定就結束程式
    return;
  }
  try {
    driver = await new webdriver.Builder().forBrowser("chrome").withCapabilities(options).build(); // 建立這個Browser的類型
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

  // 用登入後才有的元件，來判斷是否登入
  await driver.wait(until.elementLocated(By.xpath(`//*[contains(@class,"x1qhmfi1")]`)));

  // 前往粉專頁面
  const fan_page = "https://www.facebook.com/baobaonevertell/";
  await driver.get(fan_page);
  await driver.sleep(3000);

  let fb_trace = null; // 這是紀錄FB追蹤人數
  let is_accurate = true; // 確認追蹤人數是否精準
  // 因為考慮到每個粉專顯示追蹤人數的位置都不一樣，所以就採用全抓再分析
  const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"xi81zsa")]`)));
  for (const fb_trace_ele of fb_trace_eles) {
    const fb_text = await fb_trace_ele.getText();
    if (fb_text.includes('位追蹤者')) { // 新版顯示方式
      if (fb_text.includes('•')) { // 如果有就需要先特別處理
        if (fb_text.indexOf('位追蹤者') > fb_text.indexOf('•')) { // 如果是「xxx 個讚 • yyy 位追蹤者」
          fb_trace = fb_text.substr(fb_text.indexOf('•') + 1, fb_text.length);
        } else { // 如果是「yyy 位追蹤者 • 正在追蹤 x 人」
          fb_trace = fb_text.substr(0 , fb_text.indexOf('•'));
        }
      }
      if (fb_trace.includes('萬位追蹤者')) {
        fb_trace = fb_trace.substr(0, fb_trace.indexOf('萬位追蹤者')); // 超過萬需要特別計算
        fb_trace = parseFloat(fb_trace) * 10000;
        is_accurate = false;
      } else {
        fb_trace = fb_trace.replace(/\D/g, ''); // 只取數字
      }
      break;
    } else if (fb_text.includes('個讚')) {
      fb_trace = fb_text.
        substr(0, fb_text.indexOf('個讚')). // 先移除後面字串
        replace(/\D/g, ''); // 只取數字
    }
  }
  if (fb_trace === null) {
    const fb_trace_eles2 = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"pbevjfx6")]`)));
    for (const fb_trace_ele of fb_trace_eles2) {
      const fb_text = await fb_trace_ele.getText();
      if (fb_text.includes('人在追蹤')) { // 經典版顯示方式
        fb_trace = fb_text.replace(/\D/g, ''); // 只取數字
        break;
      }
    }
  }

  /* 2022.7.14 FB 改版後，即使於搜尋頁面也無法抓取到追蹤者詳細數據，故將相關程式註解（怕刪除導致讀者閱讀時的困惑）
  if (fb_trace === null) {//如果沒有抓到數字，就走查詢頁面
    is_accurate = false;
  }
  // 如果判斷追蹤人數不夠精準就需要改用搜尋的方式
  if (!is_accurate) {
    let fan_page_name = "寶寶不說";
    let fb_search_url = 'https://www.facebook.com/search/pages?q=' + fan_page_name;
    // 前往搜尋頁面
    await driver.get(fb_search_url);
    await driver.sleep(3000);
    // 因為用搜尋出來的結果不只一個，所以也採用全抓再分析
    const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"knvmm38d")]`)));
    for (const fb_trace_ele of fb_trace_eles) {
      let fb_text = await fb_trace_ele.getText();
      if (fb_text.includes('位追蹤者')) {
        // 利用關鍵字移除後面多餘的資訊
        const keyword = fb_text.indexOf("位追蹤者");
        fb_text = fb_text.substring(0, keyword);
        const search_trace = fb_text.replace(/\D/g, ''); // 只取數字
        if (fb_trace === null) {//先給預設值
          fb_trace = search_trace;
        }
        if (((search_trace - fb_trace) / fb_trace) < 0.2) { // 追蹤人數超過一萬且誤差值小於20％基本就是匹配的
          fb_trace = search_trace;
        }
        break;
      }
    }
  }
  */
  console.log(`追蹤人數：${fb_trace}`);

  //離開瀏覽器
  driver.quit();
}
loginFacebookGetTrace(); // 登入FB