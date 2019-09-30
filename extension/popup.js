const bg = chrome.extension.getBackgroundPage()
getTabId()

function getTabId () {
  const id = bg.popupGetTabId()
  let urlId = id ? id : '暂无'
  document.getElementById('current-main').innerText = urlId
}

document.addEventListener('DOMContentLoaded', function() {
  var cleanBtn = document.querySelector('.clean-btn')
  cleanBtn.addEventListener('click', function() {
    bg.popupCleanTabId()
    getTabId()
  })
})
