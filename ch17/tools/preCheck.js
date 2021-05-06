require('dotenv').config(); //載入.env環境檔
const isOnline = require('is-online');
exports.preCheck = preCheck;//讓其他程式在引入時可以使用這個函式

async function preCheck () {
  if (!await isOnline()) {
    console.error('網路連線失敗')
    return false;
  }
  try {
    checkEnv(['FB_USERNAME', 'FB_PASSWORD', 'IG_USERNAME', 'IG_PASSWORD'])
  } catch (e) {
    console.error(e.message)
    return false;
  }
  return true;
}

function checkEnv (variables) {
  var missing = [];

  variables.forEach(function (variable) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  });

  if (missing.length) {
    if (missing.length === 1) {
      throw new Error('.env缺少的變數：' + missing[0]);
    }
    throw new Error('.env缺少的變數：' + missing.join(', '));
  }
}