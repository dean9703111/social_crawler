#### [回目錄](../README.md)
## Ch33	整合LINE的爬蟲通知，專案大功告成！

### 專案使用提醒
1.	如果是 Windows 需下載與你 Chrome 版本相同的 chrome driver 放在專案根目錄
2.	請將申請好的 Google Sheets API 憑證放到「tools/google_sheets」資料夾內
3.	調整「.env」檔，填上IG/FB登入資訊、自己的SPREADSHEET_ID、LINE_TOKEN資訊
4.	調整「fan_pages」資料夾內的 json 檔，修改成自己目標爬蟲的粉專網址
5.	記得先在終端機輸入`yarn`將套件安裝
6.	套件安裝完後在終端機輸入`yarn start`即可執行（Windows請輸入`yarn win_start`）