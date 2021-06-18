function test () {
  // 宣告時給一個初始值
  const baby = "寶寶不可改變";

  // 重新指定值
  baby = "寶寶變身失敗";
  // 會跳出錯誤 TypeError: Assignment to constant variable.
}