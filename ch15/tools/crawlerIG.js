//取出.env檔案填寫的IG資訊
const ig_username = process.env.IG_USERNAME
const ig_userpass = process.env.IG_PASSWORD
const { By, until } = require('selenium-webdriver') // 從套件中取出需要用到的功能
exports.crawlerIG = crawlerIG;//讓其他檔案在引入時可以使用這個函式

async function crawlerIG (driver) {
  await loginInstagram(driver)
  const fan_page_url = "https://www.instagram.com/the_barefoot_master/"
  await goNewPage(driver, fan_page_url)
  const fan_page_name = "赤腳大仙"
  await getTrace(driver, fan_page_name)
}

async function loginInstagram (driver) {
  const ig_login_url = 'https://www.instagram.com/accounts/login';//IG登入頁面    
  await goNewPage(driver, ig_login_url)

  //填入IG登入資訊
  let ig_username_ele = await driver.wait(until.elementLocated(By.css("input[name='username']")));
  ig_username_ele.sendKeys(ig_username)
  let ig_password_ele = await driver.wait(until.elementLocated(By.css("input[name='password']")));
  ig_password_ele.sendKeys(ig_userpass)

  //抓到登入按鈕然後點擊
  const login_elem = await driver.wait(until.elementLocated(By.css("button[type='submit']")))
  login_elem.click()

  //登入後才會有右上角功能列，我們以這個來判斷是否登入
  await driver.wait(until.elementLocated(By.xpath(`//*[@id="react-root"]//*[contains(@class,"_47KiJ")]`)))
}

async function goNewPage (driver, web_url) {
  await driver.get(web_url)//在這裡要用await確保打開完網頁後才能繼續動作
  await driver.sleep(3000)
}

async function getTrace (driver, fan_page_name) {
  let ig_trace = null;//這是紀錄IG追蹤人數
  const ig_trace_xpath = `//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span`
  const ig_trace_ele = await driver.wait(until.elementLocated(By.xpath(ig_trace_xpath)))
  // IG因為當人數破萬時文字不會顯示，所以改抓title
  ig_trace = await ig_trace_ele.getAttribute('title')
  ig_trace = ig_trace.replace(/\D/g, '')//只取數字
  console.log(`「${fan_page_name}」在IG追蹤人數：${ig_trace}`)
}