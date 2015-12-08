console.log('\'Allo \'Allo!'); // eslint-disable-line no-console
jQuery.easing.def = "easeOutElastic";

$(document).ready(function() {

// live markdownizing demo
  // start with default html converted to md
  var mdOut = toMarkdown($('#toMarkdown_input').val());
  $('#toMarkdown_output').val(mdOut);
  // watch the user. if they make any true moves, update the MD damnit!
  $('#toMarkdown_input').bind('change paste keyup', function() {
    $('#toMarkdown_output').val(toMarkdown($(this).val()));
  });

// surpise demo unicorn
  // set a unicorn counter
  var unicount = 0;
  // create a function for the animation
  function animateSecret() {
    $('#secret')
      .animate({
          top: "30%",
          right: "40%"
      }, 3000, 'swing' ).animate({
          top: "-100%",
          right: "-100%"
      }, 5000, 'swing' )
  }
  // watch the user as they scroll... O.o
  $(window).scroll(function() {
    // make sure unicorn hasn't been spotted yet
    if (unicount === 0) {
      // check if demo section is visible
      if ($('#demo').visible(true)) {
        // hold a sec and start the show
        setTimeout(animateSecret, 4000);
      }
    }
  });

// nice nav scrolling
  $('#navbar a').on('click', function(e) {
    // check if it's a local anchor
    if ( $(this).attr('href').indexOf('#') === 0 ) {
      e.preventDefault();
      var target = $(this).attr('href');
      console.log(target);
      $('html, body').animate({
        scrollTop: $(target).offset().top - 50
      }, 400, 'linear');
    }
  });



});