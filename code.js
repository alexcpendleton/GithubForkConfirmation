
$(".fork-button").click(function(event) {
  var result = confirm("Are you sure you want to fork this project?");
  if(!result) { event.stopImmediatePropagation(); return false;}
});
