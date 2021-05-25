#### [回目錄](../README.md)
## Ch25	客戶：「爬蟲資料塞錯位置！」專案被報Bug的處理方式

### 專案使用提醒：
1.	如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2.	請將申請好的 Google Sheets API 憑證放到「tools/google_sheets」資料夾內
3.	調整「.env」檔，填上 IG/FB 登入資訊、自己的 SPREADSHEET_ID
4.	調整「fan_pages」資料夾內的 json 檔，修改成自己目標爬蟲的粉專網址（本章節可搭配「fan_pages/new_fb.json」使用）
5.	記得先在終端機輸入`yarn`將套件安裝
6.	套件安裝完後在終端機輸入`yarn start`即可執行