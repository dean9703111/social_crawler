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
let fan_page_array = require('../fan_pages/error.json');
console.log(fan_page_array.name)
// let fan_page_array = require('../fan_pages/empty.json');
var Validator = require('jsonschema').Validator;
var v = new Validator();
let result = v.validate(fan_page_array, schema)
let localized = result.errors.map(function (err) {
  const order = err.path[0]

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
  console.log(localized);
}