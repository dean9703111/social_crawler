const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
require('dotenv').config() //載入.env環境檔
exports.updateGoogleSheets = updateGoogleSheets;//讓其他檔案在引入時可以使用這個函式

// 範例為readonly，這樣只有讀取權限，拿掉後什麼權限都有了
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// token是在第一次執行時產生的
const TOKEN_PATH = 'tools/google_sheets/token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize (credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // 先檢查是否有token
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken (oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function getSheets (auth) {//取得Google Sheets所有的sheet
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    includeGridData: false,
  }
  try {
    const response = (await sheets.spreadsheets.get(request)).data;
    const sheets_info = response.sheets
    return sheets_info
  } catch (err) {
    console.error(err);
  }
}

async function addSheet (title, auth) {//新增一個sheet到指定的Google Sheets
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    // The ID of the spreadsheet
    "spreadsheetId": process.env.SPREADSHEET_ID,
    "resource": {
      "requests": [{
        "addSheet": {//這個request的任務是addSheet
          // 你想給這個sheet的屬性
          "properties": {
            "title": title
          }
        },
      }]
    }
  };
  try {
    const response = (await sheets.spreadsheets.batchUpdate(request)).data;
    const sheetId = response.replies[0].addSheet.properties.sheetId
    console.log('added sheet:' + title)
    return sheetId
  }
  catch (err) {
    console.log('The API returned an error: ' + err);
  }
}

async function getFBIGSheet (auth) {// 取得FB粉專、IG帳號的Sheet資訊
  const sheets = [//我們Google Sheets需要的sheet
    { title: 'FB粉專', id: null },
    { title: 'IG帳號', id: null }
  ]
  const online_sheets = await getSheets(auth)//抓目前存在的sheet

  for (sheet of sheets) {
    online_sheets.forEach(online_sheet => {
      if (sheet.title == online_sheet.properties.title) {// 如果線上已經存在相同的sheet title就直接使用相同id
        sheet.id = online_sheet.properties.sheetId
      }
    })
    if (sheet.id == null) {//如果該sheet尚未被建立，則建立
      console.log(sheet.title + ':not exsit')
      try {
        sheet.id = await addSheet(sheet.title, auth)//如果不存在就會新增該sheet        
      } catch (e) {
        console.error(e)
      }
    }
  }
  return sheets;
}
function getAuth () {
  return new Promise((resolve, reject) => {
    try {
      const content = JSON.parse(fs.readFileSync('tools/google_sheets/credentials.json'))
      authorize(content, auth => {
        resolve(auth)
      })
    } catch (err) {
      console.error('憑證錯誤');
      reject(err)
    }
  })
}
async function updateGoogleSheets () {
  try {
    const auth = await getAuth()
    let sheets = await getFBIGSheet(auth)//取得線上FB、IG的sheet資訊
    console.log(sheets)
  } catch (err) {
    console.error('更新Google Sheets失敗');
    console.error(err);
  }
}