#### [回目錄](../README.md)

## Ch23 你在文件迷路了嗎？用兩個處理 Sheet 的範例帶你攻略官方文件

### 23.2 讀取 Google Sheets 內的 sheet 資訊

[官方文件範例首頁](https://developers.google.com/sheets/api/samples)  
[spreadsheets.get 連結](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get)  
[spreadsheets.get 的範例程式](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get#examples)

### 23.4 建立放 FB 粉專、IG 帳號爬蟲資料的 sheet

[spreadsheets.batchUpdate 連結](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate)
**Try this API 的 Request body 填寫範例：**

```js
{
  "requests": [
    {
      "addSheet": {
        "properties": {
          "title": "寶寶2了"
        }
      }
    }
  ]
}
```

[spreadsheets.batchUpdate 的範例程式](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate)

### 專案使用提醒

1. 請先申請好 Google Sheets API 憑證，並將憑證放置「tools/google_sheets」資料夾內
2. 調整「.env」檔，填上自己的 SPREADSHEET_ID
3. 記得先在終端機輸入`yarn`將套件安裝
4. 套件安裝完後在終端機輸入`yarn start`即可執行

### 參考資源

[callback、Promise 和 async/await 那些事兒](https://noob.tw/js-async/)
