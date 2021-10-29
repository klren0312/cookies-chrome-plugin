const rootMenu = chrome.contextMenus.create({
  "title": "Cookie与UserAgent获取",
  "contexts": ["page"]
})

// cookie操作
const copyCookieMenu = chrome.contextMenus.create({
  "title": "提取Cookies至剪切板",
  "parentId": rootMenu,
  "contexts": ["page"]
})
// cookie原始字符串
const copyCookieByOriginMenu = chrome.contextMenus.create({
  "title": "原始数据",
  "parentId": copyCookieMenu,
  "contexts": ["page"],
  "onclick": copyCookiesByOrigin
})
const copyCookieByJSONMenu = chrome.contextMenus.create({
  "title": "JSON",
  "parentId": copyCookieMenu,
  "contexts": ["page"],
  "onclick": copyCookiesByJSON
})

const copyUAMenu = chrome.contextMenus.create({
  "title": "提取UserAgent至剪切板",
  "parentId": rootMenu,
  "contexts": ["page"],
  "onclick": copyUAFun
})

const sendCookieAndUAMenu = chrome.contextMenus.create({
  "title": "发送Cookies和UA到主页面",
  "parentId": rootMenu,
  "contexts": ["page"],
  "onclick": sendCookieAndUA
})

// 将当前页面的cookies复制到剪切板
function copyCookiesByOrigin(info, tab) {
  let cookies = ''
  chrome.cookies.getAll({
    url: tab.url
  }, cookie => {
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

function copyCookiesByJSON(info, tab) {
  let cookies = {}
  chrome.cookies.getAll({
    url: tab.url
  }, cookie => {
    // 遍历当前域名下cookie, 组成json
    cookie.forEach(v => {
      cookies[v.name]  = v.value
    })
    // 添加到剪切板
    const input = document.createElement('input')
    input.style.position = 'fixed'
    input.style.opacity = 0
    input.value = JSON.stringify(cookies)
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
  })
}

function copyCookiesByPT(info, tab) {
  chrome.cookies.getAll({
    url: tab.url
  }, cookie => {
    // 遍历当前域名下cookie, 组成json
    let arr = []
    cookie.forEach(v => {
      if (v.name === 'pt_key' || v.name === 'pt_pin') {
        arr.push(v.name + '=' + v.value)
      }
    })
    // 添加到剪切板
    const input = document.createElement('input')
    input.style.position = 'fixed'
    input.style.opacity = 0
    input.value = JSON.stringify(arr.join(';'))
    document.body.appendChild(input)
    input.select()
    document.execCommand('Copy')
    document.body.removeChild(input)
  })
}

// 将当前页面的UA复制到剪切板
function copyUAFun () {
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
let mainPageId = null
function sendCookieAndUA (info, tab) {
  let cookies = ''
  const ua = navigator.userAgent
  chrome.cookies.getAll({
    url: tab.url
  }, cookie => {
    // 遍历当前域名下cookie, 拼接成字符串
    cookie.forEach(v => {
      cookies += v.name + "=" + v.value + ";"
    })
    // 如果存在主页面的 tabId, 则将当前页的cookies发送给主页面
    let sendId = mainPageId ? mainPageId : tab.id
    chrome.tabs.sendMessage(sendId, {
      cookies: cookies,
      ua: ua
    }, response => {
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
        }, cookie => {
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
