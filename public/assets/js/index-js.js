$(document).ready(function () {
	var user = localStorage.getItem('user');
	if (user == null || user == undefined) {
		window.location = '/login';
	}
	$('.chatbox').animate({scrollTop: $('.chatbox').get(0).scrollHeight}, 0);
});