(function() {
	document.addEventListener('DOMContentLoaded', function () {
		var div = document.createElement('div')
		div.id = 'cookie-block'
		div.style.display = 'none'
		document.body.appendChild(div);
	})
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			if (request !== 'ok') {
				document.getElementById('cookie-block').innerText = request.cookies
				sendResponse('ok')
			}
		}
	)
})();
// content.js
window.addEventListener('message', event => {
	if (event.source !== window) {
		return
	}
	// 如果是主页面发送message, 则与background通信, 获取页面的 tabId
	if (event.data && event.data.hasOwnProperty('type') && event.data.type === 'tab' && event.data.hasOwnProperty('level') && event.data.level === 'main') {
		chrome.runtime.sendMessage({type: 'tab', level: 'main'}, function(response) {
      console.log('收到响应', response)
    })
	}
}, false)
