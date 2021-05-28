#### [回目錄](../README.md)
## Ch30	今天爬蟲怎麼沒有跑？來試試系統內建的排程吧！

### 30.1 用「Crontab」設定Mac排程
**Mac 編輯排程的指令**：`crontab -e`  
**本章節 crontab 的內容**：
```
PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
0 22 * * * cd /your_path/social_crawler/ch30/ && yarn start
```
**Mac 列出排程的指令**：`crontab -l`  

### 參考資源
[[Mac] macOS Catalina上的cron job遇到Operation not permitted錯誤](https://ephrain.net/mac-macos-catalina-上的-cron-job-遇到-operation-not-permitted-錯誤/)