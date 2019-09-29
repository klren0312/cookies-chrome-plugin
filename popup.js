const bg = chrome.extension.getBackgroundPage()
const id = bg.popupMethod()
let urlId = id ? id : 'test'
document.getElementById('current-main').innerText = urlId
