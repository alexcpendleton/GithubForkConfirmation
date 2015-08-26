// ==UserScript==
// @name       Github Fork Confirmation
// @namespace  https://alexcpendleton.com/
// @version    1.0.1
// @description  Adds a Confirm dialog to Github's Fork button
// @match      https://github.com/*
// @match      https://gist.github.com/*
// @include      https://github.com/*
// @include      https://gist.github.com/*
// @copyright  2014+, Alex Pendleton
// ==/UserScript==

(function () {
	function GithubForkConfirmer(messageSource) {
		var gfcAttributeName = "githubForkConfirmer";
		var gfcAttributeValue = "true"
		function isGist() {
			return window.location.toString().toLowerCase().indexOf("https://gist.github") > -1;
		}
		function createConfirmationMessage() {
			var messageName = isGist() ? "ConfirmGist" : "ConfirmProject";
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
    function MessageProvider() {
		this.getMessage = function(name) {
			var map = {
			  "ConfirmProject": {
				"message":"Are you positive you want to fork this project?"
				,"description":"Confirmation text for forking a project."
			  }
			  ,"ConfirmGist": {
				"message":"Are you positive you want to fork this Gist?"
				,"description":"Confirmation text for forking a Gist."
			  }
			};
			var message = map[name];
            return message ? message.message : "";
		};
	}
	var confirmer = new GithubForkConfirmer(new MessageProvider());
	confirmer.bind();
})();
