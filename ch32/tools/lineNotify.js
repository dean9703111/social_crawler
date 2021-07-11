const axios = require('axios');
var FormData = require('form-data');
require('dotenv').config();

function lineNotify () {
  const token = process.env.LINE_TOKEN;

  //使用 form-data 傳遞資料
  const form_data = new FormData();
  form_data.append("message", '測試 lineNotify');

  //設定 LINE Notify 的權杖 & form-data
  const headers = Object.assign({
    'Authorization': `Bearer ${token}`
  }, form_data.getHeaders());

  axios({
    method: 'post',
    url: 'https://notify-api.line.me/api/notify',
    data: form_data,
    headers: headers
  }).then(function (response) {
    //HTTP狀態碼 200 代表成功
    console.log("HTTP狀態碼:" + response.status);
    //觀察回傳的資料是否與 POSTMAN 測試一致
    console.log(response.data);
  }).catch(function (error) {
    console.error("LINE通知發送失敗");
    if (error.response) { //顯示錯誤原因            
      console.error("HTTP狀態碼:" + error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error);
    }
  });
}
lineNotify();