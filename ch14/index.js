require('dotenv').config(); //載入.env環境檔

//取出.env檔案填寫的IG資訊
const ig_username = process.env.IG_USERNAME
const ig_userpass = process.env.IG_PASSWORD
//取出.env檔案填寫的FB資訊
const fb_username = process.env.FB_USERNAME
const fb_userpass = process.env.FB_PASSWORD

const webdriver = require('selenium-webdriver'), // 加入虛擬網頁套件
  By = webdriver.By,//你想要透過什麼方式來抓取元件，通常使用xpath、css
  until = webdriver.until;//直到抓到元件才進入下一步(可設定等待時間)

const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addArguments('--log-level=3')//這個option可以讓你跟網頁端的console.log說掰掰
options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });//因為FB會有notifications干擾到爬蟲，所以要先把它關閉

const path = require('path');//用於處理文件路徑的小工具
const fs = require("fs");//讀取檔案用

function checkDriver () {
  try {
    chrome.getDefaultService()//確認是否有預設
  } catch {
    console.warn('找不到預設driver!');
    const file_path = '../chromedriver.exe'//'../chromedriver.exe'記得調整成自己的路徑
    console.log(path.join(__dirname, file_path));//請確認印出來日誌中的位置是否與你路徑相同
    if (fs.existsSync(path.join(__dirname, file_path))) {//確認路徑下chromedriver.exe是否存在            
      const service = new chrome.ServiceBuilder(path.join(__dirname, file_path)).build();//設定driver路徑
      chrome.setDefaultService(service);
      console.log('設定driver路徑');
    } else {
      console.error('無法設定driver路徑');
      return false
    }
  }
  return true
}

async function loginInstagramGetTrace (driver) {
  const web = 'https://www.instagram.com/accounts/login';//IG登入頁面
  await driver.get(web)//在這裡要用await確保打開完網頁後才能繼續動作

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

  //登入成功後要前往粉專頁面
  const fan_page = "https://www.instagram.com/the_barefoot_master/"
  await driver.get(fan_page)
  await driver.sleep(3000)

  let ig_trace = null;//這是紀錄IG追蹤人數
  const ig_trace_xpath = `//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span`
  const ig_trace_ele = await driver.wait(until.elementLocated(By.xpath(ig_trace_xpath)))
  // IG因為當人數破萬時文字不會顯示，所以改抓title
  const ig_text = await ig_trace_ele.getAttribute('title')
  ig_trace = ig_text.replace(/\D/g, '')//只取數字
  console.log(`IG追蹤人數：${ig_trace}`)
}



async function loginFacebookGetTrace (driver) {
  const web = 'https://www.facebook.com/login';//FB登入頁面
  await driver.get(web)//在這裡要用await確保打開完網頁後才能繼續動作

  //填入FB登入資訊
  const fb_email_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="email"]`)));//找出填寫email的元件
  fb_email_ele.sendKeys(fb_username)//將使用者的資訊填入
  const fb_pass_ele = await driver.wait(until.elementLocated(By.xpath(`//*[@id="pass"]`)));
  fb_pass_ele.sendKeys(fb_userpass)

  //抓到登入按鈕然後點擊
  const login_elem = await driver.wait(until.elementLocated(By.xpath(`//*[@id="loginbutton"]`)))
  login_elem.click()

  //用登入後才有的元件，來判斷是否登入
  await driver.wait(until.elementLocated(By.xpath(`//*[contains(@class,"fzdkajry")]`)))

  //前往粉專頁面
  const fan_page = "https://www.facebook.com/baobaonevertell/"// 筆者是寶寶不說的狂熱愛好者
  await driver.get(fan_page)
  await driver.sleep(3000)

  let fb_trace = null;//這是紀錄FB追蹤人數
  let is_accurate = true;//確認追蹤人數是否精準
  //因為考慮到每個粉專顯示追蹤人數的位置都不一樣，所以就採用全抓再分析
  const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"knvmm38d")]`)))
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
    let fan_page_name = "寶寶不說"
    let fb_search_url = 'https://www.facebook.com/search/pages?q=' + fan_page_name
    //  前往搜尋頁面
    await driver.get(fb_search_url)
    await driver.sleep(3000)
    //因為用搜尋出來的結果不只一個，所以也採用全抓再分析
    const fb_trace_eles = await driver.wait(until.elementsLocated(By.xpath(`//*[contains(@class,"knvmm38d")]`)))  
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
  }
  console.log(`FB追蹤人數：${fb_trace}`)
}

async function crawler () {
  let driver
  try {
    if (!checkDriver()) {// 檢查driver是否是設定，如果無法設定就結束程式
      return
    }
    driver = await new webdriver.Builder().
      forBrowser("chrome").withCapabilities(options, {
        acceptSslCerts: true, acceptInsecureCerts: true
      }//這是為了解決跨網域問題 
      ).build();

    //考慮到IG在不同螢幕寬度時的Xpath不一樣，所以我們要在這裡設定統一的視窗大小
    await driver.manage().window().setRect({ width: 1280, height: 800, x: 0, y: 0 });
  } catch (e) {
    console.error('無法建立瀏覽器!');
    console.error(e);
    return
  }

  //因為有些人是用FB帳號登入IG，為了避免增加FB登出的動作，所以採取先對IG進行爬蟲
  await loginInstagramGetTrace(driver)
  await loginFacebookGetTrace(driver)

  driver.quit();
}
crawler()