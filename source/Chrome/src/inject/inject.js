(function () {
	function GithubForkConfirmer(messageSource) {
		var gfcAttributeName = "githubForkConfirmer";
		var gfcAttributeValue = "true"
		function isGist() {
			return window.location.toString().toLowerCase().indexOf("https://gist.github") > -1;
		}
		function createConfirmationMessage() {
			var messageName = isGist() ? "ConfirmGist" : "ConfirmRepository";
			return messageSource.getMessage(messageName);
		}
		function onFork(event) {
			var result = confirm(createConfirmationMessage());
			if (!result) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				return false;
			}
			return true;
		}

		function findAndSetBindings() {
			// When going to a Gist from the "All Gists" page, this script is never reloaded because it's using the History API or something
			// From a content script we don't have access to history events (I couldn't find them anyway)
			// So instead we wait for any click event on the page and then look for the fork button and subscribe to its click event
			document.addEventListener("click", function(event) {
				var selector = "form[action*='/fork'] button[type='submit']";
				var forkButton = document.querySelector(selector);
				if(forkButton) {
					var hasAttribute = forkButton.getAttribute(gfcAttributeName);
					if(!hasAttribute) {
						forkButton.setAttribute(gfcAttributeName, gfcAttributeValue);
						forkButton.addEventListener("click", onFork);
					}
				}
			}, true);
		}
		this.bind = function() {
			findAndSetBindings();
		}
	}
	var confirmer = new GithubForkConfirmer(chrome.i18n);
	confirmer.bind();
})();
