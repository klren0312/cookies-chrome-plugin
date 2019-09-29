let cookies = '';

/**
 * 文档加载完毕
 * 获取当前激活tab
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    if (!chrome.cookies) {
      chrome.cookies = chrome.experimental.cookies;
    }
    chrome.cookies.getAll({
      url: tab.url
    }, function (cookie) {
      cookie.forEach(v => {
        cookies += v.name + "=" + v.value + ";"
      })
    })
  }
})

function copyCookies(info, tab) {
  const input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = cookies;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // https://zhuanlan.zhihu.com/p/57820028

    // console.log('receive', sender, request)
    sendResponse(request.target);
  }
);


var parent = chrome.contextMenus.create({
  "title": "Cookie提取助手",
  "contexts": ["page"]
});
var copyCookie = chrome.contextMenus.create({
  "title": "提取Cookies至剪切板",
  "parentId": parent,
  "contexts": ["page"],
  "onclick": copyCookies
});
