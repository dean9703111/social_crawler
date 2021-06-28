#### [回目錄](../README.md)

## Ch29 用 pm2 套件來控管 Node.js 排程，背景執行才是王道！

### 29.1 在 Mac 砍掉執行中的 Node.js 排程

**用「ps」找出執行中的排程，指令**：`ps aux | { head -1; fgrep schedule.js; }`

### 29.2 在 Windows 砍掉執行中的 Node.js 排程

[WIMC 官方文件](https://docs.microsoft.com/zh-tw/Windows/win32/wmisdk/wmic)  
**用「WMIC」找出執行中的排程，指令**：`wmic process where "commandline like '%schedule.js'" get processid,commandline`  
**透過「WMIC」的指令，將執行中的排程關閉**：`wmic process where "commandline like '%schedule.js'" call terminate`

### 29.3 使用套件「pm2」來管理 Node.js 程式

[pm2 官方網站](https://pm2.keymetrics.io/)  
**全域安裝 pm2 的指令**：`npm install pm2 -g`  
**用 pm2 啟動程式的指令**：`pm2 start tools/schedule.js --name social_crawler`

### 29.4 使用「pm2-logrotate」來切割 log

[pm2-logrotate 官方文件](https://github.com/keymetrics/pm2-logrotate#readme)  
**pm2-logrotate 安裝指令**：`pm2 install pm2-logrotate`

### 29.5 用「pm2 ecosystem」取代「pm2 CLI」

**產生範例 ecosystem 檔案的指令**：`pm2 ecosystem`  
**執行 ecosystem 檔案**：`pm2 start ecosystem.config.js`  
[pm2 ecosystem 官方文件](https://pm2.keymetrics.io/docs/usage/application-declaration/)

### 29.7 讓 Mac 重啟時 pm2 自動啟動

**設定開機自動啟動 pm2 的指令：**`pm2 startup`
**移除開機自動啟動 pm2 的指令：**`pm2 unstartup launchd`

### 29.8 讓 Windows 重啟時 pm2 自動啟動

**全域安裝 pm2-windows-service 的指令**：`npm install -g pm2-windows-service`  
**用系統管理員的身份執行 cmd，輸入指令安裝**：`pm2-service-install -n PM2`  
**關閉 pm2-windows-service 服務**：`pm2-service-uninstall -n PM2`

### 專案使用提醒：

1. 如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2. 請將申請好的 Google Sheets API 憑證放到「tools/google_sheets」資料夾內
3. 調整「.env」檔，填上 IG/FB 登入資訊、自己的 SPREADSHEET_ID
4. 調整「fan_pages」資料夾內的 json 檔，修改成自己目標爬蟲的粉專網址
5. 記得先在終端機輸入`yarn`將套件安裝
6. 在終端機下指令`npm install pm2 -g`，讓你在終端機的任何位置都能管控排程
7. 在終端機輸入`yarn pm2_start`讓 pm2 控管排程

### 參考資源

[pm2 - 用法大全](https://tn710617.github.io/zh-tw/pm2/)  
[window 環境下建立開機自動重啟 pm2](https://ithelp.ithome.com.tw/articles/10243636)
