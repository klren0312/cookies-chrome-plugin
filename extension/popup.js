const bg = chrome.extension.getBackgroundPage()

document.addEventListener('DOMContentLoaded', ()=> {
  initPopup()
  // 清除tabid事件
  const cleanBtn = document.querySelector('.clean-btn')
  cleanBtn.addEventListener('click', function() {
    bg.popupCleanTabId()
    initPopup()
  })
})

/**
 * 初始化弹框数据
 */
function initPopup () {
  // 从背景获取tabid
  const id = bg.popupGetTabId()
  let urlId = id ? id : '暂无'
  document.getElementById('current-main').innerText = urlId

  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const currentTab = tabs.length ? tabs[0] : null
    if (currentTab) {
      const url = new URL(currentTab.url)
      chrome.cookies.getAll({
        domain: url.hostname
      }, cookies => {
        const list = document.getElementById('js-cookies-list')
        const listStr = cookies.map(c => {
          return `<tr>
              <td><strong>${c.name}: </strong></td>
              <td><input style="width:100%" value=${c.value} /></td>
          </tr>`
        }).join('')
        list.innerHTML = listStr
      })
      document.getElementById('js-user-agent').innerHTML = navigator.userAgent
    }
  })
}
