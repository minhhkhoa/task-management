module.exports = (query) => {
  let objSearch = {
    keyWord: "",
  }
  if (query.keyWord) {
    objSearch.keyWord = query.keyWord
    const regex = new RegExp(objSearch.keyWord, "i") //i: ko phan biet hoa thg
    // console.log(regex): /iphone/i
    objSearch.regex = regex
  }

  return objSearch
}