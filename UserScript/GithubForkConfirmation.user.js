// ==UserScript==
// @name       Github Fork Confirmation
// @namespace  https://alexcpendleton.com/
// @version    1.0
// @description  Adds a Confirm dialog to Github's Fork button 
// @match      https://github.com/*
// @match      https://gist.github.com/*
// @copyright  2014+, Alex Pendleton
// ==/UserScript==

(function($) {
    function isGist() {
       return window.location.toString().toLowerCase().indexOf("https://gist.github") > -1;
    }
    function createConfirmationMessage() {
        var forkableType = isGist() ? "Gist" : "project";
        // TODO: Multi-language support?
        return "Are you positive you want to fork this " + forkableType + "?";        
    }
    $(".fork-button").click(function(event) {
        var result = confirm(createConfirmationMessage());
        if(!result) { 
            event.stopImmediatePropagation(); 
            return false;
        }
    });
})(unsafeWindow.jQuery);