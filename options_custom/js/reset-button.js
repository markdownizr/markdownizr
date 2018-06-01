window.addEvent("domready", function () {
  var reset = document.querySelector('#reset');
  reset.addEventListener('click', function() {
    var settings = document.querySelectorAll('textarea.setting');
    for (var i = 0; i < settings.length; i++) {
			settings[i].value = settings[i].dataset.default;
		}
  });
});
