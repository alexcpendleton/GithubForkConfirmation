(function() {
    function isGist() {
       return window.location.toString().toLowerCase().indexOf("https://gist.github") > -1;
    }
    function createConfirmationMessage() {
        var messageName = isGist() ? "ConfirmGist" : "ConfirmProject";
        return chrome.i18n.getMessage(messageName);
    }
	var forkButton = document.querySelector(".fork-button");
    function onFork(event) {
        var result = confirm(createConfirmationMessage());
        if(!result) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
        }
        return true;
    }
    forkButton.addEventListener("click", onFork, false);
})();