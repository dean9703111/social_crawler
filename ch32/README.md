#### [回目錄](../README.md)
## Ch32	用axios發出LINE通知

### 32.1 axios基礎介紹
[axios 官方文件](https://github.com/axios/axios#readme)  
**安裝 axios 套件的指令**：`yarn add axios`  
**安裝 form-data 套件的指令**：`yarn add form-data`  

### 專案使用提醒
1.	調整「.env」檔，填上LINE_TOKEN資訊
2.	記得先在終端機輸入`yarn`將套件安裝
3.	套件安裝完後在終端機輸入`node tools/lineNotify.js`發出 LINE Notify 的 request

### 參考資源
[由前端request的幾種方法](https://medium.com/dot-js/由前端request-的幾種方法-fbf8a0b4023a)  
[5 Ways to Make HTTP Requests in Node.js](https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html)  
[axios 基本使用 & Config](https://ithelp.ithome.com.tw/articles/10212120)  