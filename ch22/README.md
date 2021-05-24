#### [回目錄](../README.md)
## Ch22	了解官方範例在做什麼事

### 22.1 套件不是照著官方文件安裝就沒事了
[官方文件指定安裝版本](https://developers.google.com/sheets/api/quickstart/nodejs#step_1_install_the_client_library)  
[官方 npm 套件](https://www.npmjs.com/package/googleapis)  

### 22.2 分析官方範例程式
[上個章節的範例程式](../ch21/tools/google_sheets/index.js)  

### 22.4 撰寫函式讀取指定的Google Sheets
[官方範例的Google Sheets](https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0)  

### 專案使用提醒
1.	請先申請好 Google Sheets API 憑證，並將憑證放置「tools/google_sheets」資料夾內
2.	調整「.env」檔，填上自己的 SPREADSHEET_ID
3.	記得先在終端機輸入`yarn`將套件安裝
4.	套件安裝完後在終端機輸入`node tools/google_sheets/index.js`即可執行