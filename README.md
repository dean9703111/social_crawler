# JavaScript 爬蟲新思路！

### 2022.7.14 公告

在這裡向所有讀者致上最深刻的歉意 😢  
因 FB 改版的速度與內容變化太快，導致每個粉絲頁的顯示邏輯差異越來越大 😭  
且於搜尋頁面也無法抓取破萬粉絲的詳細追蹤者數量 😭😭😭 
經多方考量後決定暫停更新程式 🙇🏻🙇🏻🙇🏻 
不過書中所提供的邏輯＆方法還是可以參考與使用的，期望讀者可以從中吸取網路爬蟲的相關知識  

沒意料到 FB 有如此重大更新，再次向讀者們致上最深刻的歉意 🙇🏻🙇🏻🙇🏻 

## 從零開始帶你用 Node. js 打造 FB＆IG 爬蟲專案

![image](./img/bar.jpeg)

有興趣的朋友可以到天瓏書局選購，感謝大家的支持。[購書連結](https://www.tenlong.com.tw/products/9789864348008)

### 參考資源目錄

### PART 2 開發前環境介紹＆設定

[Ch3. 開發前環境介紹＆設定](/ch3)

### PART 3 寫程式所需的基礎常識（Node.js）

[Ch4. 寫程式時該注意的基本原則](/ch4)  
[Ch5. 認識 Node.js 專案](/ch5)  
[Ch6. 用 Yarn 安裝及控管套件](/ch6)  
[Ch7. 善用「.env」管理環境變數，幫你快速遷移專案](/ch7)  
[Ch8. 在「.gitignore」設定不加入版控的資料](/ch8)

### PART 4 用 selenium-webdriver 爬蟲網頁資訊

[Ch9. 爬蟲之前](/ch9)  
[Ch10. 認識 selenium-webdriver：操作所見即所得的爬蟲工具](/ch10)  
[Ch11. 爬蟲第一步，FB 先登入](/ch11)  
[Ch12. 關閉瀏覽器彈窗，取得 FB 粉專追蹤數](/ch12)  
[Ch13. 舉一反三，帶你了解 IG 爬蟲不可忽略的細節](/ch13)  
[Ch14. 將 FB 與 IG 爬蟲融合](/ch14)  
[Ch15. 重構程式碼，減少歷史業障](/ch15)  
[Ch16. 用 try-catch 捕獲爬蟲的過程中發生的錯誤](/ch16)  
[Ch17. json x 爬蟲 = 瑣事自動化](/ch17)  
[Ch18. 驗證 json 檔的內容是否符合格式](/ch18)  
[Ch19. 優化爬蟲的小技巧](/ch19)

### PART 5 使用 Google Sheets 儲存爬蟲資訊

[Ch21. 免費儲存資料的好選擇，一起進入省錢起手式](/ch21)  
[Ch22. 了解官方範例在做什麼事](/ch22)  
[Ch23. 你在文件迷路了嗎？用兩個處理 Sheet 的範例帶你攻略官方文件](/ch23)  
[Ch24. 寫入爬蟲資料，告別 Copy & Paste 的日子](/ch24)  
[Ch25. 客戶：「爬蟲資料塞錯位置！」專案被報 Bug 的處理方式](/ch25)  
[Ch26. 客戶：「我希望新資料插在最前面！」如何談需求變更](/ch26)  
[Ch27. 優化格式，滿足客戶需求＆談使用者體驗](/ch27)

### PART 6 設定排程自動執行爬蟲程式

[Ch28. 用 schedule 套件讓爬蟲自己動起來](/ch28)  
[Ch29. 用 pm2 套件來控管排程，背景執行才是王道！](/ch29)  
[Ch30. 今天爬蟲怎麼沒有跑？來試試系統內建的排程吧！](/ch30)

### PART 7 透過 LINE 回報爬蟲狀況

[Ch31. 透過 POSTMAN 了解 LINE Notify 如何使用](/ch31)  
[Ch32. 用 axios 發出 LINE 通知](/ch32)  
[Ch33. 整合 LINE 的爬蟲通知，專案大功告成！](/ch33)

> _免責聲明：書中教學與範例程式僅抓取公開數據作爲研究，任何組織和個人不得以此技術盜取他人智慧財產、造成網站損害，否則一切后果由該組織或個人承擔。作者不承擔任何法律及連帶責任！_

> ### 更新紀錄
>
> **2021.11.15**：因應 FB 改版，微調爬蟲程式邏輯，解決「追蹤人數」精確度判定問題，相關 commit 請看：[連結](https://github.com/dean9703111/social_crawler/commit/6de0cc0d598c8b4cf8d2d7db5a4f7a6fcd579677)  
> **2021.11.18**：因應 IG 改版，調整登入檢測程式；並修改部分範例連結，相關 commit 請看：[連結](https://github.com/dean9703111/social_crawler/commit/fe7118dceb474150a93320d7db82b7edcbdd5b87)  
> **2021.12.13**：因應 IG 改版，調整抓取追蹤人數的 XPath，相關 commit 請看：[連結](https://github.com/dean9703111/social_crawler/commit/854245776e6631f27fd8957be8df891791d6d3c0)  
> **2021.12.17**：因應 IG 改版，調整抓取追蹤人數的 XPath(IG 最近很喜歡改來改去的 QQ)，相關 commit 請看：[連結](https://github.com/dean9703111/social_crawler/commit/7836528ae38606af2edb05bfc1fec101f705e127)  
> **2021.2.13**：因應 IG 改版，調整抓取追蹤人數的 XPath(IG 常常會有路徑上細微的調整)，相關 commit 請看：[連結](https://github.com/dean9703111/social_crawler/commit/1736b56e3a3fb341c6f3d37b8b88b801c545d8da)  
> **2021.3.22**：因應 FB 改版，調整確認是否登入的 Class，相關 commit 請看：[連結](https://github.com/dean9703111/social_crawler/commit/0583009d8aa24613e7a409d7ba51daeab11f7968)  
> **2021.4.27**：因應 FB 改版，調整搜尋粉絲頁面的文字分析，相關 commit 請看：[連結](https://github.com/dean9703111/social_crawler/commit/199ec02b328a8731e400bc18baded1270ab45965)  
> **2021.6.1**：因應 IG 改版，粉絲人數原本用 Xpath，現在改用 Class 來抓，相關 commit 請看：[連結](https://github.com/dean9703111/social_crawler/commit/630a00b6f1b1a2cdb5f9fb46ad30aaf36ea5f1c6)