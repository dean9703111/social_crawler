function test () {
  // 宣告時給一個初始值
  let baby = "寶寶本尊";

  // 重新指定值
  baby = "寶寶變身";
  console.log(baby); // 會印出'寶寶變身'

  // 再次宣告
  let baby = "寶寶壞掉了";
  // 會跳出錯誤 SyntaxError: Identifier 'baby' has already been declared
}