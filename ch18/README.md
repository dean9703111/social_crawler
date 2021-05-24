#### [回目錄](../README.md)
## Ch18	驗證json的內容是否符合格式

### 18.2 認識驗證json格式的套件 - jsonschema
[jsonschema 官方文件](https://github.com/tdegrunt/jsonschema#readme)  
**安裝驗證 json 格式的套件**：`yarn add jsonschema`  

### 18.4 用jsonschema來驗證json粉專清單
用來測試錯誤 json 的 [testJsonschema.js](testJsonschema.js)
* 測試粉專 json 不得為空的：[empty.json](empty.json)
* 測試粉專 json 有錯的：[error.json](error.json)
**可在終端機輸入指令來驗證 json 格式**：`node day18/tools/testJsonschema.js`  

### 專案使用提醒
1.	如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2.	調整「.env」檔，填上 IG、FB 登入資訊
3.	調整「fan_pages」資料夾內的 json 檔，修改成自己目標爬蟲的粉專網址
4.	記得先在終端機輸入`yarn`將套件安裝
5.	套件安裝完後在終端機輸入`yarn start`即可執行
6.	此章節建議搭配「day18/tools/testJsonschema.js」的程式幫助你熟悉套件