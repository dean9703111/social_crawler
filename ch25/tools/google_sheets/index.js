const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const dateFormat = require('dateformat');
require('dotenv').config(); //載入.env環境檔
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
  };
  try {
    let response = (await sheets.spreadsheets.get(request)).data;
    const sheets_info = response.sheets;
    return sheets_info;
  } catch (err) {
    console.error(err);
  }
}

async function addSheet (title, auth) {//新增一個Sheet到指定的Google Sheets
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
    const sheetId = response.replies[0].addSheet.properties.sheetId;
    console.log('added sheet:' + title);
    return sheetId;

  }
  catch (err) {
    console.log('The API returned an error: ' + err);
  }
}

async function getFBIGSheet (auth) {// 取得FB粉專、IG帳號的Sheet資訊
  const sheets = [//我們Google Sheets需要的sheet
    { title: 'FB粉專', id: null },
    { title: 'IG帳號', id: null }
  ];
  const online_sheets = await getSheets(auth);//抓目前存在的sheet

  for (sheet of sheets) {
    online_sheets.forEach(online_sheet => {
      if (sheet.title == online_sheet.properties.title) {// 如果線上已經存在相同的sheet title就直接使用相同id
        sheet.id = online_sheet.properties.sheetId;
      }
    });
    if (sheet.id == null) {//如果該sheet尚未被建立，則建立
      console.log(sheet.title + ':not exsit');
      try {
        sheet.id = await addSheet(sheet.title, auth);//如果不存在就會新增該sheet        
      } catch (e) {
        console.error(e);
      }
    }
  }
  return sheets;
}

async function writeSheet (title, result_array, auth) {
  // 取得線上第一欄的粉專名稱
  let online_name_array = await readName(title, auth);
  // 如果json檔有新增的粉專就補到最後面
  result_array.forEach(fan_page => {
    if (!online_name_array.includes(`=HYPERLINK("${fan_page.url}","${fan_page.name}")`)) {
      online_name_array.push(`=HYPERLINK("${fan_page.url}","${fan_page.name}")`);
    }
  });

  // 以"粉專名稱+粉專網址"作為寫入追蹤人數欄位的判斷
  let trace_array = [];
  online_name_array.forEach(name => {
    let fan_page = result_array.find(fan_page => `=HYPERLINK("${fan_page.url}","${fan_page.name}")` == name);
    if (fan_page) {
      trace_array.push([fan_page.trace]);
    } else {
      trace_array.push([]);
    }
  });

  const datetime = new Date();
  if (online_name_array[0] !== title) {//如果是全新的Sheet就會在開頭插入
    online_name_array.unshift(title);
    trace_array.unshift([dateFormat(datetime, "GMT:yyyy/mm/dd")]);
  } else {//如果不是全新就取代
    trace_array[0] = [dateFormat(datetime, "GMT:yyyy/mm/dd")];
  }

  await writeName(title, online_name_array.map(title => [title]), auth);
  let lastCol = await getLastCol(title, auth);
  await writeTrace(title, trace_array, lastCol, auth);
}

async function writeName (title, name_array, auth) {//name都是寫入第一欄
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    valueInputOption: "USER_ENTERED",// INPUT_VALUE_OPTION_UNSPECIFIED|RAW|USER_ENTERED
    range: [
      `'${title}'!A:A`
    ],
    resource: {
      values: name_array
    }
  };
  try {
    await sheets.spreadsheets.values.update(request);
    console.log(`updated ${title} name`);
  } catch (err) {
    console.error(err);
  }
}

async function getLastCol (title, auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    ranges: [
      `'${title}'!A1:ZZ1`
    ],
    majorDimension: "COLUMNS",
  };
  try {
    let values = (await sheets.spreadsheets.values.batchGet(request)).data.valueRanges[0].values;
    // console.log(title + " StartCol: " + toColumnName(values.length + 1))
    return toColumnName(values.length + 1);
  } catch (err) {
    console.error(err);
  }
}

function toColumnName (num) {//Google Sheets無法辨認數字欄位，需轉為英文才能使用
  for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
  }
  return ret;
}

async function writeTrace (title, trace_array, lastCol, auth) {//填入追蹤者人數
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    valueInputOption: "USER_ENTERED",// INPUT_VALUE_OPTION_UNSPECIFIED|RAW|USER_ENTERED
    range: [
      `'${title}'!${lastCol}:${lastCol}`
    ],
    resource: {
      values: trace_array
    }
  };
  try {
    await sheets.spreadsheets.values.update(request);
    console.log(`updated ${title} trace`);
  } catch (err) {
    console.error(err);
  }
}

async function readName (title, auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    ranges: [
      `'${title}'!A:A`
    ],
    valueRenderOption: "FORMULA"
  };
  try {
    let name_array = [];
    let values = (await sheets.spreadsheets.values.batchGet(request)).
      data.valueRanges[0].values;
    if (values) {//如果沒資料values會是undefine，所以我們只在有資料時塞入
      name_array = values.map(value => value[0]);
    }
    // console.log(name_array)
    return name_array;
  } catch (err) {
    console.error(err);
  }
}

function getAuth () {
  return new Promise((resolve, reject) => {
    try {
      const content = JSON.parse(fs.readFileSync('tools/google_sheets/credentials.json'));
      authorize(content, auth => {
        resolve(auth);
      });
    } catch (err) {
      console.error('憑證錯誤');
      reject(err);
    }
  });
}
async function updateGoogleSheets (ig_result_array = [], fb_result_array = []) {
  try {
    const auth = await getAuth();
    let sheets = await getFBIGSheet(auth);//取得線上FB、IG的sheet資訊
    console.log('FB、IG Sheet資訊:');
    console.log(sheets);

    // 寫入各自的Sheet
    await writeSheet('FB粉專', fb_result_array, auth);
    await writeSheet('IG帳號', ig_result_array, auth);
    console.log(`成功更新Google Sheets：https://docs.google.com/spreadsheets/d/${process.env.SPREADSHEET_ID}`);
  } catch (err) {
    console.error('更新Google Sheets失敗');
    console.error(err);
  }
}