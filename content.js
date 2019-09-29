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
	if (event.data && event.data.hasOwnProperty('type') && event.data.type === 'cookie') {
		console.log('页面数据', event.data)
	}
}, false)
