$(document).ready(function () {
	var user = JSON.parse(localStorage.getItem('user'));
	if (user == null || user == undefined) {
		window.location = '/login';
	}
	function generateBlockYouChat(avatar, message) {
		var output = "";
			output += '<div class="linechat">';
				output += '<div><img src="' + avatar + '"></div>';
				output += '<div class="textchat youchat">';
					output += '<span>' + message + '</span>';
				output += '</div>';
			output += '</div>';
		return output;
	};
	function generateBlockMeChat(message) {
		var output = "";
			output += '<div class="linechat">';
				output += '<div class="textchat mechat">';
					output += '<span>' + message + '</span>';
				output += '</div>';
			output += '</div>';
		return output;
	};
	$('.chatbox').animate({scrollTop: $('.chatbox').get(0).scrollHeight}, 0);
	var chatlist = user.chatlist;
	for (var id in chatlist) {
		console.log('id' + id + ' has value ' + chatlist[id]);
	}
	function getChat() {
		var id = $('.active').attr('data-id');
		var mode = $('.active').attr('data-mode');
		$.ajax({
		    url: "/message/" + mode + "/" + id,
		    headers: {
		    	"Authorization": user.token
		    },
		    type: "GET",
	     	success: function(data) {
	     		for (let id in data) {
	     			let dataSplit = data[id].split('/-id-/');
	     			$.get("/avatar/" + dataSplit[0], function(avt) {
	 					if (dataSplit[0] == user.id) {
		     				$('#resultsChat').prepend(generateBlockMeChat(dataSplit[1]));
		     			} else {
		     				$('#resultsChat').prepend(generateBlockYouChat(avt, dataSplit[1]));
		     			}
	 				});
				}
	     	}
		});
	}
	getChat();
});