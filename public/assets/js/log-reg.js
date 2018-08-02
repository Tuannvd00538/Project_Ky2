$(document).ready(function() {
    $('input[name=username]').keyup(function(e) {
    	if (e.which == 32) {
            return false;
    	}
        if ($(this).val().length <= 5) {
        	$('#username').removeClass('has-success').addClass('has-error');
        	$('#username span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
        } else {
        	$('#username').removeClass('has-error').addClass('has-success');
        	$('#username span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
        }
    });
});