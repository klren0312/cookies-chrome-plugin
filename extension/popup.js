document.addEventListener('DOMContentLoaded', ()=> {
  getTabId()
})

function getTabId () {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const currentTab = tabs.length ? tabs[0] : null
    if (currentTab) {
      document.getElementById('current-main').innerText = currentTab ? currentTab.id: '暂无'
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
