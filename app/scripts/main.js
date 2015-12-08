console.log('\'Allo \'Allo!'); // eslint-disable-line no-console

$( document ).ready(function() {

// live markdownizing demo
  // start with default html converted to md
  var mdOut = toMarkdown($('#toMarkdown_input').val());
  $('#toMarkdown_output').val(mdOut);
  // watch the user. if they make any true moves, update the MD damnit!
  $('#toMarkdown_input').bind('change paste keyup', function() {
    $('#toMarkdown_output').val(toMarkdown($(this).val()));
  });

});