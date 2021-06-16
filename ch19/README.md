#### [回目錄](../README.md)
## Ch19 優化爬蟲的小技巧

### 19.4 偽裝瀏覽器身份
[知道當下瀏覽器的 user-agent](https://gs.statcounter.com/detect)  
**專案的「user-agent」參數**：`options.addArguments("user-agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'")`  
**可在終端機輸入指令來確認「user-agent」是否成功偽裝**：`node day19/tools/getUserAgent.js`  

### 專案使用提醒
1.	如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2.	調整「.env」檔，填上 IG、FB 登入資訊、瀏覽器啟動的選項
3.	調整「fan_pages」資料夾內的 json 檔，修改成自己目標爬蟲的粉專網址
4.	記得先在終端機輸入`yarn`將套件安裝
5.	套件安裝完後在終端機輸入`yarn start`即可執行
6.	此章節建議搭配「day19/tools/getUserAgent.js」的程式幫助你了解user-agent的作用

### 參考資源
[selenium啓動Chrome的進階配置參數](https://stackoverflow.max-everyday.com/2019/12/selenium-chrome-options/)  
[Can't interact with Instagram while headless.](https://github.com/puppeteer/puppeteer/issues/6318)   
[[ Selenium ] 偽造身份進行網路爬蟲](https://hardliver.blogspot.com/2018/04/selenium.html)  

