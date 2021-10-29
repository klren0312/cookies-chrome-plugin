getTabId()

function getTabId () {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    document.getElementById('current-main').innerText = tabs.length ? tabs[0].id: '暂无'
  })
}

document.addEventListener('DOMContentLoaded', function() {
  var cleanBtn = document.querySelector('.clean-btn')
  cleanBtn.addEventListener('click', function() {
    document.getElementById('current-main').innerText = ''
    getTabId()
  })
})
