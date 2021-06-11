require('dotenv').config(); //載入.env環境檔
const isOnline = require('is-online');
var Validator = require('jsonschema').Validator;

exports.preCheck = preCheck;//讓其他檔案在引入時可以使用這個函式
exports.checkEnv = checkEnv;
exports.jsonValidator = jsonValidator;

async function preCheck () {
  if (!await isOnline()) {
    console.error('網路連線失敗')
    return false;
  }
  try {
    checkEnv(['FB_USERNAME', 'FB_PASSWORD', 'IG_USERNAME', 'IG_PASSWORD','SPREADSHEET_ID'])
  } catch (e) {
    console.error(e.message)
    return false;
  }
  return true;
}

function checkEnv (variables) {
  let missing = [];

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

function jsonValidator (file_name, fan_page_array) {
  var v = new Validator();
  const schema = {
    "type": "array",
    "minItems": 1,
    "uniqueItems": true,
    "items": {
      "properties": {
        "name": { "type": "string" },
        "url": { "type": "string" }
      },
      "required": ["name", "url"]
    }
  }
  let result = v.validate(fan_page_array, schema)
  let stop_crawler = false
  let localized = result.errors.map(function (err) {
    const order = err.path[0]
    if (err.name === 'required' || err.name === 'type' || err.name === 'minItems') {
      // 如果有資訊上的錯誤就直接終止爬蟲
      stop_crawler = true
    } if (err.name === 'uniqueItems') {
      //過濾掉重複的
      fan_page_array = fan_page_array.filter((fan_page, index, self) =>
        index === self.findIndex(f => (f.url === fan_page.url && f.title === fan_page.title))
      )
    }

    if (err.name === 'required') {
      return `第${order}個物件的「${err.argument}」為必填`;
    } else if (err.name === 'type') {
      return `第${order}個物件的「${err.path[1]}」須為字串`;
    } else if (err.name === 'uniqueItems') {
      return `警告：有重複的物件`
    } else if (err.name === 'minItems') {
      return `警告：json內容為空`
    }
  });
  if (!result.valid) {
    console.error(`請依據下方提示，檢查 ${file_name} 的內容：`);
    console.error(localized);
  }
  if (stop_crawler) {
    return false
  }
  return fan_page_array
}