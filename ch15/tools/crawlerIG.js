//取出.env檔案填寫的IG資訊
const ig_username = process.env.IG_USERNAME;
const ig_userpass = process.env.IG_PASSWORD;
const { By, until } = require('selenium-webdriver'); // 從套件中取出需要用到的功能
exports.crawlerIG = crawlerIG;//讓其他檔案在引入時可以使用這個函式

async function crawlerIG (driver) {
  await loginInstagram(driver);
  //const fan_page_url = "https://www.instagram.com/the_barefoot_master/"; //此粉專以改名
  const fan_page_url = "https://www.instagram.com/baobaonevertell/";
  await goNewPage(driver, fan_page_url);
  const fan_page_name = "寶寶不說";
  await getTrace(driver, fan_page_name);
}

async function loginInstagram (driver) {
  const ig_login_url = 'https://www.instagram.com';//IG登入頁面    
  await goNewPage(driver, ig_login_url);

  //填入IG登入資訊
  let ig_username_ele = await driver.wait(until.elementLocated(By.css("input[name='username']")));
  ig_username_ele.sendKeys(ig_username);
  let ig_password_ele = await driver.wait(until.elementLocated(By.css("input[name='password']")));
  ig_password_ele.sendKeys(ig_userpass);

  //抓到登入按鈕然後點擊
  const login_ele = await driver.wait(until.elementLocated(By.css("button[type='submit']")));
  login_ele.click();

  //登入後才會有右上角功能列，我們以這個來判斷是否登入
  await driver.wait(until.elementLocated(By.xpath(`//*[contains(@class,"xvbhtw8")]`)));
}

async function goNewPage (driver, web_url) {
  await driver.get(web_url);//在這裡要用await確保打開完網頁後才能繼續動作
  await driver.sleep(3000);
}

async function getTrace (driver, fan_page_name) {
  let ig_trace = null;//這是紀錄IG追蹤人數
  // const ig_trace_xpath = `//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/div/span`;
  // 原本的 Xpath 被 IG 改掉了，改用 Class 來抓
  const ig_trace_xpath =`//*[contains(@class,"_ac2a")]`
  const ig_trace_eles = await driver.wait(until.elementsLocated(By.xpath(ig_trace_xpath)));
  // 剛好這個 Class 只有 3 個，我們需要的資訊在第 2 個 Class，IG 因為當人數破萬時會縮寫顯示，所以改抓title
  const ig_text = await ig_trace_eles[1].getAttribute('title');
  if (ig_text.includes('萬')) {
    ig_trace = ig_text.substr(0, ig_text.indexOf('萬')); // 超過萬需要特別計算
    ig_trace = parseFloat(ig_text) * 10000;
  } else {
    ig_trace = ig_text.replace(/\D/g, '');//只取數字
  }
  console.log(`「${fan_page_name}」在IG追蹤人數：${ig_trace}`);
}