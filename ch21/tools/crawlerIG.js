//取出.env檔案填寫的IG資訊
const ig_username = process.env.IG_USERNAME
const ig_userpass = process.env.IG_PASSWORD
const { By, until } = require('selenium-webdriver') // 從套件中取出需要用到的功能
const { jsonValidator } = require("../tools/preCheck.js");
let fan_page_array = require('../fan_pages/ig.json');
exports.crawlerIG = crawlerIG;//讓其他程式在引入時可以使用這個函式

async function crawlerIG (driver) {
  fan_page_array = jsonValidator('ig.json', fan_page_array)
  if (!fan_page_array) {
    return
  }
  if (await loginInstagram(driver)) {
    console.log(`IG開始爬蟲`)
    for (fan_page of fan_page_array) {
      if (await goNewPage(driver, fan_page.url)) {
        const trace = await getTrace(driver, fan_page.name)
        if (trace === null) {
          console.log(`「${fan_page.name}」無法抓取追蹤人數`)
        } else {
          console.log(`「${fan_page.name}」追蹤人數：${trace}`)
        }
      }
    }
  }
}

async function goNewPage (driver, web_url) {
  try {
    await driver.get(web_url)//在這裡要用await確保打開完網頁後才能繼續動作
    await driver.sleep(3000)
    return true
  } catch (e) {
    console.error(`無效的網址：${web_url}`)
    console.error(e)
    return false
  }
}

async function loginInstagram (driver) {
  const ig_login_url = 'https://www.instagram.com/accounts/login';//IG登入頁面  
  if (await goNewPage(driver, ig_login_url)) {
    try {
      //填入ig登入資訊
      let ig_username_ele = await driver.wait(until.elementLocated(By.css("input[name='username']")), 3000);
      ig_username_ele.sendKeys(ig_username)
      let ig_password_ele = await driver.wait(until.elementLocated(By.css("input[name='password']")), 3000);
      ig_password_ele.sendKeys(ig_userpass)

      //抓到登入按鈕然後點擊
      const login_elem = await driver.wait(until.elementLocated(By.css("button[type='submit']")), 3000)
      login_elem.click()

      //登入後才會有右上角功能列，我們以這個來判斷是否登入
      await driver.wait(until.elementLocated(By.xpath(`//*[@id="react-root"]//*[contains(@class,"_47KiJ")]`)), 5000)
      return true
    } catch (e) {
      console.error('IG登入失敗')
      console.error(e)
      return false
    }
  }
}

async function getTrace (driver, fan_page_name) {
  let ig_trace = 0;//這是紀錄IG追蹤人數
  try {
    const ig_trace_xpath = `//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span`
    const ig_trace_ele = await driver.wait(until.elementLocated(By.xpath(ig_trace_xpath)), 3000)
    // ig因為當人數破萬時文字不會顯示，所以改抓title
    ig_trace = await ig_trace_ele.getAttribute('title')
    ig_trace = ig_trace.replace(/\D/g, '')//只取數字
    return ig_trace
  } catch (e) {
    console.error(`「${fan_page_name}」無法讀取IG追蹤人數`)
    console.error(e)
    return null
  }
}