#### [回目錄](../README.md)
## Ch21	免費儲存資料的好選擇，一起進入省錢起手式

### 21.1 取得Google Sheets憑證（credentials
[取得 Google Sheets 憑證的官方教學](https://developers.google.com/sheets/api/quickstart/nodejs)  
[Google Cloud Console 首頁](https://console.cloud.google.com/)  
[應用程式憑證的授權有效期限](https://developers.google.com/identity/protocols/oauth2#expiration)  
**官方文件中安裝 googleapis 套件的指令**：`yarn add googleapis@39`  

### 21.2 在專案加入官方提供的範例程式做測試
[Google Sheets 官方範例程式](https://developers.google.com/sheets/api/quickstart/nodejs#step_2_set_up_the_sample)  

### 專案使用提醒
1.	請先申請好 Google Sheets API 憑證，並將憑證放置「tools/google_sheets」資料夾內
2.	申請到的「credentials.json」憑證可在後續的章節使用無需再次申請。
3.	記得先在終端機輸入`yarn`將套件安裝
4.	套件安裝完後在終端機輸入`node tools/google_sheets/index.js`即可執行