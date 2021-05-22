#### [回目錄](../README.md)
## Ch16	用try-catch捕獲爬蟲的過程中發生的錯誤

### 16.4 加入preCheck.js做為第一道防線
**安裝檢查網路環境的套件**：`yarn add is-online`  

### 專案使用提醒
1.	如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2.	調整「.env」檔，填上 IG、FB 登入資訊
3.	記得先在終端機輸入`yarn`將套件安裝
4.	套件安裝完後在終端機輸入`yarn start`即可執行