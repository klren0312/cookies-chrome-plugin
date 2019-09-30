let mainPageId = null

// 将当前页面的cookies复制到剪切板
function copyCookies(info, tab) {
  let cookies = ''
  chrome.cookies.getAll({
    url: tab.url
  }, function (cookie) {
    // 遍历当前域名下cookie, 拼接成字符串
    cookie.forEach(v => {
      cookies += v.name + "=" + v.value + ";"
    })
    // 添加到剪切板
    const input = document.createElement('input')
    input.style.position = 'fixed'
    input.style.opacity = 0
    input.value = cookies
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
  })
}

// 将当前页面的UA复制到剪切板
function copyUA () {
  const input = document.createElement('input')
  input.style.position = 'fixed'
  input.style.opacity = 0
  input.value = navigator.userAgent
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
}

// 发送Cookies和UA到主页面
function sendCookieAndUA (info, tab) {
  let cookies = ''
  const ua = navigator.userAgent
  chrome.cookies.getAll({
    url: tab.url
  }, function (cookie) {
    // 遍历当前域名下cookie, 拼接成字符串
    cookie.forEach(v => {
      cookies += v.name + "=" + v.value + ";"
    })
    // 如果存在主页面的 tabId, 则将当前页的cookies发送给主页面
    let sendId = mainPageId ? mainPageId : tab.id
    chrome.tabs.sendMessage(sendId, {
      cookies: cookies,
      ua: ua
    }, function(response) {
      console.log(response)
    })
  })
}

// 给popup使用的方法
// 获取页面ID
function popupGetTabId () {
  return mainPageId
}
// 清除页面ID
function popupCleanTabId () {
  mainPageId = null
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // https://zhuanlan.zhihu.com/p/57820028
    if (request !== 'ok') {
      if (request.type === 'tab') {
        if (request.level === 'main') { // 如果页面是主页面, 则将其 tabId 缓存, 并发送给主页面
          mainPageId = sender.tab.id
          sendResponse({type: 'tab', level: 'main', tabId: sender.tab.id})
        }
      } else if (request.type === 'cookies') {
        let cookies = ''
        chrome.cookies.getAll({
          url: request.target
        }, function (cookie) {
          // 遍历当前域名下cookie, 拼接成字符串
          cookie.forEach(v => {
            cookies += v.name + "=" + v.value + ";"
          })
          sendResponse({type: 'cookies', cookies: cookies})
        })
      }

    }
  }
)

var parent = chrome.contextMenus.create({
  "title": "Cookie与UserAgent获取",
  "contexts": ["page"]
})
var copyCookie = chrome.contextMenus.create({
  "title": "提取Cookies至剪切板",
  "parentId": parent,
  "contexts": ["page"],
  "onclick": copyCookies
})

var copyUA = chrome.contextMenus.create({
  "title": "提取UserAgent至剪切板",
  "parentId": parent,
  "contexts": ["page"],
  "onclick": copyUA
})

var sendCookieAndUA = chrome.contextMenus.create({
  "title": "发送Cookies和UA到主页面",
  "parentId": parent,
  "contexts": ["page"],
  "onclick": sendCookieAndUA
})
