#### [回目錄](../README.md)

## Ch28 用 schedule 套件讓爬蟲自己動起來

### 28.1 排程套件：「node-schedule」

[node-schedule 套件說明文件](https://github.com/node-schedule/node-schedule#readme)  
**安裝 node-schedule 套件的指令**：`yarn add node-schedule`  
**超簡單範例：**

```js
const schedule = require("node-schedule");
const job = schedule.scheduleJob("* * * * * *", function () {
  console.log(`${new Date()} 每秒鐘都會看到這個訊息呢∼ `);
});
```

**執行 schedule 範例的指令**：`node tools/schedule.js`

### 28.2 把排程加入爬蟲

[node 如何執行 Javascript 指定 function 的指令寫法](https://stackoverflow.com/questions/30782693/run-function-in-script-from-command-line-node-js)

### 專案使用提醒：

1. 如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2. 請將申請好的 Google Sheets API 憑證放到「tools/google_sheets」資料夾內
3. 調整「.env」檔，填上 IG/FB 登入資訊、自己的 SPREADSHEET_ID
4. 調整「fan_pages」資料夾內的 json 檔，修改成自己目標爬蟲的粉專網址
5. 記得先在終端機輸入`yarn`將套件安裝
6. 套件安裝完後在終端機輸入`yarn schedule`執行排程

### 參考資源

[Run function in script from command line (Node JS)](https://stackoverflow.com/questions/30782693/run-function-in-script-from-command-line-node-js)
