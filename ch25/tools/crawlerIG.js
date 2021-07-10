const ig_username = process.env.IG_USERNAME;
const ig_userpass = process.env.IG_PASSWORD;
const short_time = parseInt(process.env.SHORT_TIME) || 3000;
const long_time = parseInt(process.env.LONG_TIME) || 5000;

const { By, until } = require('selenium-webdriver'); // 從套件中取出需要用到的功能
const { jsonValidator } = require("../tools/preCheck.js");
let fan_page_array = require('../fan_pages/ig.json');
exports.crawlerIG = crawlerIG;//讓其他檔案在引入時可以使用這個函式

async function crawlerIG (driver) {
  fan_page_array = jsonValidator('ig.json', fan_page_array);
  if (!fan_page_array) {
    return;
  }
  if (await loginInstagram(driver)) {
    console.log(`IG開始爬蟲`);
    let result_array = [];
    for (fan_page of fan_page_array) {
      let trace = null;
      try {
        if (await goNewPage(driver, fan_page.url)) {
          trace = await getTrace(driver, fan_page.name);
          if (trace === null) {
            console.log(`「${fan_page.name}」無法抓取追蹤人數`);
          } else {
            console.log(`「${fan_page.name}」追蹤人數：${trace}`);
          }
        }
      } catch (e) {
        console.error(e);
        continue;
      } finally {
        result_array.push({
          url: fan_page.url,
          name: fan_page.name,
          trace: trace
        });
      }
    }
    return result_array;
  }
}

async function goNewPage (driver, web_url) {
  try {
    await driver.get(web_url);//在這裡要用await確保打開完網頁後才能繼續動作
    //每個頁面爬蟲停留3~6秒，不要造成別人的伺服器負擔
    const random_time = (Math.floor(Math.random() * 4) + 3) * 1000;
    await driver.sleep(random_time);
    return true;
  } catch (e) {
    console.error(`無效的網址：${web_url}`);
    console.error(e);
    return false;
  }
}

async function loginInstagram (driver) {
  const ig_login_url = 'https://www.instagram.com/accounts/login';//IG登入頁面  
  if (await goNewPage(driver, ig_login_url)) {
    try {
      //填入IG登入資訊
      let ig_username_ele = await driver.wait(until.elementLocated(By.css("input[name='username']")), short_time);
      ig_username_ele.sendKeys(ig_username);
      let ig_password_ele = await driver.wait(until.elementLocated(By.css("input[name='password']")), short_time);
      ig_password_ele.sendKeys(ig_userpass);

      //抓到登入按鈕然後點擊
      const login_ele = await driver.wait(until.elementLocated(By.css("button[type='submit']")), short_time);
      login_ele.click();

      //登入後才會有右上角功能列，我們以這個來判斷是否登入
      await driver.wait(until.elementLocated(By.xpath(`//*[@id="react-root"]//*[contains(@class,"_47KiJ")]`)), long_time);
      return true;
    } catch (e) {
      console.error('IG登入失敗');
      console.error(e);
      return false;
    }
  }
}

async function getTrace (driver, fan_page_name) {
  let ig_trace = null;//這是紀錄IG追蹤人數
  try {
    const ig_trace_xpath = `//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span`;
    const ig_trace_ele = await driver.wait(until.elementLocated(By.xpath(ig_trace_xpath)), short_time);
    // IG因為當人數破萬時會縮寫顯示，所以改抓title
    ig_trace = await ig_trace_ele.getAttribute('title');
    ig_trace = ig_trace.replace(/\D/g, '');//只取數字
    return ig_trace;
  } catch (e) {
    console.error(`「${fan_page_name}」無法讀取IG追蹤人數`);
    console.error(e);
    return null;
  }
}