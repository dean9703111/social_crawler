require('dotenv').config(); //載入.env環境檔
function getEnvVariable () {
  const env_variable = process.env.YOUR_VARIABLE // 取出環境變數
  console.log(env_variable)
}
getEnvVariable()