const fb_username = process.env.FB_USERNAME;
const fb_userpass = process.env.FB_PASSWORD;
const short_time = parseInt(process.env.SHORT_TIME) || 3000;
const long_time = parseInt(process.env.LONG_TIME) || 5000;

const { By, until } = require('selenium-webdriver'); // 從套件中取出需要用到的功能
const { jsonValidator } = require("../tools/preCheck.js");
let fan_page_array = require('../fan_pages/fb.json');
exports.crawlerFB = crawlerFB;//讓其他檔案在引入時可以使用這個函式

async function crawlerFB (driver) {
  fan_page_array = jsonValidator('fb.json', fan_page_array);
  if (!fan_page_array) {
    return;
  }
  if (await loginFacebook(driver)) {
    console.log(`FB開始爬蟲`);
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

async function loginFacebook (driver) {
  const fb_login_url = 'https://www.facebook.com/login';//FB登入頁面
  if (await goNewPage(driver, fb_login_url)) {
    try {
      //填入FB登入資訊
      const fb_email_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="email"]`)), short_time);
      fb_email_ele.sendKeys(fb_username);
      const fb_pass_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="pass"]`)), short_time);
      fb_pass_ele.sendKeys(fb_userpass);

      //抓到登入按鈕然後點擊
      const login_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginbutton"]`)), short_time);
      login_ele.click();

      //因為登入這件事情要等Server回應，你直接跳轉粉絲專頁會導致登入失敗
      //用登入後才有的元件，來判斷是否登入
      await driver.wait(until.elementLocated(By.xpath(`//*[contains(@class,"om3e55n1")]`)), long_time);
      return true;
    } catch (e) {
      console.error('FB登入失敗');
      console.error(e);
      return false;
    }
  }
}

async function getTrace (driver, fan_page_name) {
  let fb_trace = null;//這是紀錄FB追蹤人數
  let is_accurate = true;//確認追蹤人數是否精準
  try {
    //因為考慮到每個粉專顯示追蹤人數的位置都不一樣，所以就採用全抓再分析
    const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"g4qalytl")]`)), short_time);
    for (const fb_trace_ele of fb_trace_eles) {
      const fb_text = await fb_trace_ele.getText();
      if (fb_text.includes('位追蹤者')) { // 新版顯示方式
        if (fb_text.includes('萬位追蹤者')) {
          fb_trace = fb_text.substr(0, fb_text.indexOf('萬位追蹤者')); // 超過萬需要特別計算
          // 如果粉絲頁顯示「xxx 個讚 • yyy 萬位追蹤者」就會需要用到下面的方案解析
          fb_trace = fb_trace.substr(fb_trace.indexOf('•') + 1, fb_trace.length);
          fb_trace = parseFloat(fb_trace) * 10000;
          is_accurate = false;
        } else {
          fb_trace = fb_text.replace(/\D/g, ''); // 只取數字
        }
        break;
      } else if (fb_text.includes('個讚')) {
        fb_trace = fb_text.
          substr(0, fb_text.indexOf('個讚')). // 先移除後面字串
          replace(/\D/g, ''); // 只取數字
      }
    }
    if (fb_trace === null) {
      const fb_trace_eles2 = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"pbevjfx6")]`)), short_time);
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
      fb_trace = await getTraceFromSearch(driver, fan_page_name, fb_trace);
    }
    */
    return fb_trace;
  } catch (e) {
    console.error(`「${fan_page_name}」無法讀取FB追蹤人數`);
    console.error(e);
    return null;
  }
}

async function getTraceFromSearch (driver, fan_page_name, fb_trace) {
  let fb_search_url = 'https://www.facebook.com/search/pages?q=' + fan_page_name;
  try {
    //  前往搜尋頁面
    await goNewPage(driver, fb_search_url);
    //因為用搜尋出來的結果不只一個，所以也採用全抓再分析
    const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"knvmm38d")]`)), short_time);
    for (const fb_trace_ele of fb_trace_eles) {
      let fb_text = await fb_trace_ele.getText();
      if (fb_text.includes('位追蹤者')) {
        //利用關鍵字移除後面多餘的資訊
        const keyword = fb_text.indexOf("位追蹤者");
        fb_text = fb_text.substring(0, keyword);
        const search_trace = fb_text.replace(/\D/g, '');//只取數字
        if (fb_trace === null) {//先給預設值
          fb_trace = search_trace;
        }
        if (((search_trace - fb_trace) / fb_trace) < 0.2) {//追蹤人數超過一萬且誤差值小於20％基本就是匹配的
          fb_trace = search_trace;
        }
        break;
      }
    }
    return fb_trace;
  } catch (e) {
    console.error(`「${fan_page_name}」在FB粉專搜尋頁面，無法讀取FB追蹤人數`);
    console.error(e);
    return null;
  }
}