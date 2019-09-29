(function() {
	document.addEventListener('DOMContentLoaded', function () {
		var div = document.createElement('div')
		div.id = 'cookie-block'
		div.style.display = 'none'
		document.body.appendChild(div);
	})
})();
// content.js
window.addEventListener('message', event => {
	if (event.source !== window) {
		return
	}
	if (event.data && event.data.hasOwnProperty('type') && event.data.type === 'cookie') {
		console.log('页面数据', event.data.type)
		chrome.runtime.sendMessage(event.data, function(response) {
			console.log(response)
		})
	}

}, false)
