require('dotenv').config(); //載入.env環境檔

//取出.env檔案填寫的IG資訊
const ig_username = process.env.IG_USERNAME;
const ig_userpass = process.env.IG_PASSWORD;

const webdriver = require('selenium-webdriver'), // 加入虛擬網頁套件
  By = webdriver.By,//你想要透過什麼方式來抓取元件，通常使用xpath、css
  until = webdriver.until;//直到抓到元件才進入下一步(可設定等待時間)

const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addArguments('--log-level=3');//這個option可以讓你跟網頁端的console.log說掰掰
options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });//因為FB會有notifications干擾到爬蟲，所以要先把它關閉

const path = require('path');//用於處理文件路徑的小工具
const fs = require("fs");//讀取檔案用

function checkDriver () {
  try {
    chrome.getDefaultService();//確認是否有預設
  } catch {
    console.warn('找不到預設driver!');
    const file_path = '../chromedriver.exe';//'../chromedriver.exe'記得調整成自己的路徑
    console.log(path.join(__dirname, file_path));//請確認印出來日誌中的位置是否與你路徑相同
    if (fs.existsSync(path.join(__dirname, file_path))) {//確認路徑下chromedriver.exe是否存在            
      const service = new chrome.ServiceBuilder(path.join(__dirname, file_path)).build();//設定driver路徑
      chrome.setDefaultService(service);
      console.log('設定driver路徑');
    } else {
      console.error('無法設定driver路徑');
      return false;
    }
  }
  return true;
}

async function loginInstagramGetTrace () {
  if (!checkDriver()) {// 檢查driver是否是設定，如果無法設定就結束程式
    return;
  }
  let driver;
  try {
    driver = await new webdriver.Builder().forBrowser("chrome").withCapabilities(options).build();// 建立這個Browser的類型
    //考慮到IG在不同螢幕寬度時的Xpath不一樣，所以我們要在這裡設定統一的視窗大小
    await driver.manage().window().setRect({ width: 1280, height: 800, x: 0, y: 0 });
  } catch (e) {
    console.error('無法建立瀏覽器!');
    console.error(e);
    return;
  }
  const web = 'https://www.instagram.com/accounts/login';//IG登入頁面
  await driver.get(web);//在這裡要用await確保打開完網頁後才能繼續動作

  //填入IG登入資訊
  let ig_username_ele = await driver.wait(until.elementLocated(By.css("input[name='username']")));
  ig_username_ele.sendKeys(ig_username);
  let ig_password_ele = await driver.wait(until.elementLocated(By.css("input[name='password']")));
  ig_password_ele.sendKeys(ig_userpass);

  //抓到登入按鈕然後點擊
  const login_ele = await driver.wait(until.elementLocated(By.css("button[type='submit']")));
  login_ele.click();

  //登入後才會有右上角功能列，我們以這個來判斷是否登入
  await driver.wait(until.elementLocated(By.xpath(`//*[@id="react-root"]//*[contains(@class,"_47KiJ")]`)));

  //登入成功後要前往粉專頁面
  const fan_page = "https://www.instagram.com/the_barefoot_master/";
  await driver.get(fan_page);
  await driver.sleep(3000);

  let ig_trace = null;//這是紀錄IG追蹤人數
  const ig_trace_xpath = `//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span`;
  const ig_trace_ele = await driver.wait(until.elementLocated(By.xpath(ig_trace_xpath)));
  // IG因為當人數破萬時會縮寫顯示，所以改抓title
  const ig_text = await ig_trace_ele.getAttribute('title');
  ig_trace = ig_text.replace(/\D/g, '');//只取數字
  console.log(`追蹤人數：${ig_trace}`);
  driver.quit();
}
loginInstagramGetTrace();//登入IG並取得追蹤人數