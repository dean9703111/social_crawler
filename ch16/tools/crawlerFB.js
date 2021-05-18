//取出.env檔案填寫的FB資訊
const fb_username = process.env.FB_USERNAME
const fb_userpass = process.env.FB_PASSWORD
const { By, until } = require('selenium-webdriver') // 從套件中取出需要用到的功能
exports.crawlerFB = crawlerFB;//讓其他程式在引入時可以使用這個函式

async function crawlerFB (driver) {
  if (await loginFacebook(driver)) {
    const fan_page_url = "https://www.facebook.com/baobaonevertell/"
    if (await goNewPage(driver, fan_page_url)) {
      const fan_page_name = "寶寶不說"
      const trace = await getTrace(driver, fan_page_name)
      console.log(`「${fan_page_name}」在FB追蹤人數：${trace}`)
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

async function loginFacebook (driver) {
  const fb_login_url = 'https://www.facebook.com/login';//FB登入頁面
  if (await goNewPage(driver, fb_login_url)) {
    try {
      //填入fb登入資訊
      const fb_email_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="email"]`)), 3000);
      fb_email_ele.sendKeys(fb_username)
      const fb_pass_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="pass"]`)), 3000);
      fb_pass_ele.sendKeys(fb_userpass)

      //抓到登入按鈕然後點擊
      const login_elem = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginbutton"]`)), 3000)
      login_elem.click()

      //因為登入這件事情要等server回應，你直接跳轉粉絲專頁會導致登入失敗
      //用登入後才有的元件，來判斷是否登入
      await driver.wait(until.elementLocated(By.xpath(`//*[contains(@class,"fzdkajry")]`)), 5000)
      return true
    } catch (e) {
      console.error('FB登入失敗')
      console.error(e)
      return false
    }
  }
}

async function getTrace (driver, fan_page_name) {
  let fb_trace = null;//這是紀錄FB追蹤人數
  let is_accurate = true;//確認追蹤人數是否精準
  try {
    //因為考慮到每個粉專顯示追蹤人數的位置都不一樣，所以就採用全抓再分析
    const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"knvmm38d")]`)), 3000)
    for (const fb_trace_ele of fb_trace_eles) {
      const fb_text = await fb_trace_ele.getText()
      if (fb_text.includes('人在追蹤')) {// 經典版顯示方式
        fb_trace = fb_text
        break
      } else if (fb_text.includes('位追蹤者')) {// 新版顯示方式
        if (fb_text.includes('萬位追蹤者')) {
          fb_trace = fb_text.replace(' 萬位追蹤者', '')// 超過萬需要特別計算
          fb_trace = parseFloat(fb_trace) * 10000
          is_accurate = false
        } else {
          fb_trace = fb_text.replace(/\D/g, '')// 只取數字
        }
        break
      }
    }
    // 如果判斷追蹤人數不夠精準就需要改用搜尋的方式
    if (!is_accurate) {
      fb_trace = await getTraceFromSearch(driver, fan_page_name, fb_trace)
    }
    return fb_trace
  } catch (e) {
    console.error(`「${fan_page_name}」無法讀取FB追蹤人數`)
    console.error(e)
    return null
  }
}

async function getTraceFromSearch (driver, fan_page_name, fb_trace) {
  let fb_search_url = 'https://www.facebook.com/search/pages?q=' + fan_page_name
  try {
    //  前往搜尋頁面
    await goNewPage(driver, fb_search_url)
    //因為用搜尋出來的結果不只一個，所以也採用全抓再分析
    const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"knvmm38d")]`)), 3000)
    for (const fb_trace_ele of fb_trace_eles) {
      let fb_text = await fb_trace_ele.getText()
      if (fb_text.includes('粉絲專頁') && fb_text.includes('位追蹤者')) {
        //利用關鍵字移除後面多餘的資訊
        const keyword = fb_text.indexOf("位追蹤者");
        fb_text = fb_text.substring(0, keyword);
        const search_trace = fb_text.replace(/\D/g, '')//只取數字
        if (((search_trace - fb_trace) / fb_trace) < 0.2) {//追蹤人數超過一萬且誤差值小於20％基本就是匹配的
          fb_trace = search_trace
        }
        break
      }
    }
    return fb_trace
  } catch (e) {
    console.error(`「${fan_page_name}」在FB粉專搜尋頁面，無法讀取FB追蹤人數`)
    console.error(e)
    return null
  }
}