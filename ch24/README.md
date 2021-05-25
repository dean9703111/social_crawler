#### [回目錄](../README.md)
## Ch24	寫入爬蟲資料，告別Copy & Paste的日子

### 24.4 將FB、IG粉專爬蟲資料寫入各自的sheet
[spreadsheets.values.update 連結](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update)  
[spreadsheets.values.batchGet 連結](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet)  

### 專案使用提醒：
1.	如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2.	請將申請好的 Google Sheets API 憑證放到「tools/google_sheets」資料夾內
3.	調整「.env」檔，填上 IG/FB 登入資訊、自己的 SPREADSHEET_ID
4.	調整「fan_pages」資料夾內的 json 檔，修改成自己目標爬蟲的粉專網址
5.	記得先在終端機輸入`yarn`將套件安裝
6.	套件安裝完後在終端機輸入`yarn start`即可執行
