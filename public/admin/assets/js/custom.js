var user = JSON.parse(localStorage.getItem('user'));
if (user == null || user == undefined) {
    window.location = '/login';
}
var token = user.token;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
if (parseJwt(token).exp < (Date.now() / 1000)) {
    localStorage.clear();
    window.location = '/login';
}

function generateBlockUser(avatar, username, fullname, email, birthday, gender, status) {
	var output = "";
		output += '<tr>';
	        output += '<td>';
	            output += '<img src="' + avatar + '" width="50px" height="50px" class="avtTable"/>';
	        output += '</td>';
	        output += '<td class="tdUsername">' + username + '</td>';
	        output += '<td>' + fullname + '</td>';
	        output += '<td>' + email + '</td>';
	        output += '<td>' + birthday + '</td>';
	        output += '<td>' + gender + '</td>';
	        output += '<td>' + status + '</td>';
	    output += '</tr>';
    return output;
}

$(document).ready(function () {
	$.ajax({
        url: "/admin/list/user",
        headers: {
            "Authorization": token
        },
        type: "GET",
        success: function(data) {
        	for (var id in data) {
        		let gender = "";
        		if (data[id].gender == 1) {
        			gender = 'Nam';
        		} else {
        			gender = 'Nữ';
        		}
        		$('#rsUser').append(generateBlockUser(data[id].avatar, data[id].username, data[id].fullname, data[id].email, data[id].birthday, gender, data[id].status));
        	}
        }
    });
    $('.ml-1').html(user.fullname + ' <i class="mdi mdi-chevron-down"></i>');
    $('.rounded-circle').attr('src', user.avatar);
});