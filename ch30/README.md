#### [回目錄](../README.md)

## Ch30 今天爬蟲怎麼沒有跑？來試試系統內建的排程吧！

### 30.1 用「Crontab」設定 Mac 排程

**Finder 前往資料夾的路徑**：`/usr/sbin/cron`  
**Mac 編輯排程的指令**：`crontab -e`  
**本章節 crontab 的內容（記得將 your_path 更換成自己的路徑）**：

```
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
0 22 * * * cd /[your_path]/social_crawler/ch30/ && yarn start
```

**Mac 列出排程的指令**：`crontab -l`

### 30.2 用「taskschd」設定 Windows 排程

在執行視窗輸入`taskschd.msc`進入排程設定頁面

### 參考資源

[[Mac] macOS Catalina 上的 cron job 遇到 Operation not permitted 錯誤](https://ephrain.net/mac-macos-catalina-上的-cron-job-遇到-operation-not-permitted-錯誤/)
