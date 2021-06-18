const axios = require('axios');
var FormData = require('form-data');
require('dotenv').config();
module.exports.lineNotify = lineNotify;
function combineErrNameMsg (error_name_array, type) {
  let error_msg = "";
  for (const error_name of error_name_array) {
    error_msg = `${error_msg}\n${error_name}`;
  }
  if (error_msg !== "") {
    error_msg = `\n下列${type}無法取得追蹤人數:${error_msg}`;
  }
  return error_msg;
}
function combineMsg (spend_time, ig_result, fb_result) {
  let error_msg = "";
  if (ig_result.error_msg) {
    error_msg += `\n${ig_result.error_msg}`;
  } else {
    error_msg += combineErrNameMsg(ig_result.error_name_array, "IG帳號");
  }

  if (fb_result.error_msg) {
    error_msg += `\n${fb_result.error_msg}`;
  } else {
    error_msg += combineErrNameMsg(fb_result.error_name_array, "FB粉專");
  }
  if (error_msg !== "") {
    error_msg = `\n\n❗錯誤訊息❗：${error_msg}`;
  }
  // 組合傳送訊息
  const message =
    `\n\n已完成今日爬蟲排程作業` +
    `\n共費時:${spend_time}` +
    `\n總計掃描FB粉專: ${fb_result.result_array.length} 、IG帳號: ${ig_result.result_array.length}` +
    `\nGoogle Sheet: https://docs.google.com/spreadsheets/d/${process.env.SPREADSHEET_ID}` +
    error_msg;
  return message;
}
async function lineNotify (type, result) {
  const token = process.env.LINE_TOKEN;
  let message = "";
  if (type) {
    message = combineMsg(result.spend_time, result.ig_result, result.fb_result);
  } else {
    message = result;
  }

  const form_data = new FormData();
  form_data.append("message", message);

  const headers = Object.assign({
    'Authorization': `Bearer ${token}`
  }, form_data.getHeaders());

  axios({
    method: 'post',
    url: 'https://notify-api.line.me/api/notify',
    data: form_data,
    headers: headers
  }).then(function (response) {
    // HTTP狀態碼 200 代表成功
    console.log("HTTP狀態碼:" + response.status);
    // 觀察回傳的資料是否與 POSTMAN 測試一致
    console.log(response.data);
  }).catch(function (error) {
    console.error("LINE通知發送失敗");
    if (error.response) { // 顯示錯誤原因            
      console.error("HTTP狀態碼:" + error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error);
    }
  });
}