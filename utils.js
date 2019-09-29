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
    chrome.tabs.sendMessage(tab.id, {cookies: cookies}, function(response) {
      console.log(response)
    });
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

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // https://zhuanlan.zhihu.com/p/57820028
    if (request !== 'ok') {
      let cookies = ''
      chrome.cookies.getAll({
        url: request.target
      }, function (cookie) {
        // 遍历当前域名下cookie, 拼接成字符串
        cookie.forEach(v => {
          cookies += v.name + "=" + v.value + ";"
        })
        sendResponse(cookies)
      })
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
