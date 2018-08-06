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
var chatlist = user.chatlist;
for (var id in chatlist) {
    console.log('id' + id + ' has value ' + chatlist[id]);
}

Notification.requestPermission(function(e) {
    if (e !== 'denied') {
        console.log('Notification', 'Accept');
    }
});

function logout() {
    localStorage.clear();
    window.location = '/login';
}

$(document).ready(function() {
    $('.helloname').text(user.fullname);
    $(".newmsg-icon").click(function(event) {
        $(".content-right").attr("style", "display:none;")
        $(".welcome").attr("style", "display:none;")
        $(".content-right-newmsg").attr("style", "display:block;")
        $("#newmsg").attr("style", "display:block;")
    });
    $(".closenewmsg").click(function () {
        // $(".welcome").attr("style", "display:none;")
        $(".content-right-newmsg").attr("style", "display:none;")
        $("#newmsg").attr("style", "display:none;")
        $(".welcome").attr("style", "display:block;")
    });
});