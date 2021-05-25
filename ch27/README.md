#### [回目錄](../README.md)
## Ch27	優化格式，滿足客戶需求＆談使用者體驗

### 27.3 優化用手機看Google Sheets的體驗
[官方窗口凍結的方法：frozenRowCount、frozenColumnCount](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets?hl=en#gridproperties)   
[透過「updateDimensionProperties」更新表格，其中「pixelSize」可設定欄位寬度](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets#DimensionProperties)  

### 專案使用提醒：
1.	如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2.	請將申請好的 Google Sheets API 憑證放到「tools/google_sheets」資料夾內
3.	調整「.env」檔，填上 IG/FB 登入資訊、自己的 SPREADSHEET_ID
4.	調整「fan_pages」資料夾內的 json 檔，修改成自己目標爬蟲的粉專網址
5.	程式執行前先把Google Sheets中「FB粉專、IG帳號」這兩個 sheet更名為「old_FB粉專、old_IG帳號」，才會觸發「窗口凍結」
6.	記得先在終端機輸入`yarn`將套件安裝
7.	套件安裝完後在終端機輸入`yarn start`即可執行

### 參考資源
[了解使用者體驗 (UX) 的第一堂課](https://designtongue.me/了解使用者體驗-ux-的第一堂課/)
