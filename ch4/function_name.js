// 不好的命名，你無法從名字理解他要做的事情
function abc (a, b) {
  return a + b
}

// 好的命名，淺顯易懂
function sum (a, b) {
  return a + b
}

// 不好的命名，一個函式做太多事情了
function goIndexPageWriteContent () { }
// 好的命名，一個函式做一件事，上面的function可以拆分成下面兩個
function goIndexPage () { }
function writeContent () { }