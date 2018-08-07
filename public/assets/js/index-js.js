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

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = hour + ':' + min;
    return time;
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

function generateBlockListChat(mode, id, avt, name, time, msg) {
    var output = "";
    output += '<a href="/' + mode + '/' + id + '">';
    output += '<div class="name-contact">';
    output += '<div class="row infochat">';
    output += '<div class="col-md-3">';
    output += '<div class="avatar"> ';
    output += '<img src="' + avt + '"/>';
    output += '</div>';
    output += '</div>';
    output += '<div class="col-md-9 details">';
    output += '<span class="chatname">' + name + '</span>';
    output += '<span class="datemsg">' + time + '</span>';
    output += '<p class="msg">' + msg + '</p>';
    output += '</div>';
    output += '</div>';
    output += '</div>';
    output += '</a>';
    return output;
}
for (var id in chatlist) {
    $.ajax({
        url: "/list/" + chatlist[id] + "/" + id + "?me=" + user.id,
        headers: {
            "Authorization": token
        },
        type: "GET",
        success: function(data) {
            var mode = chatlist[id];
            var avt = data.avatar;
            var name = data.fullname;
            var list = data.chat;
            var time = msg = "";
            for (let id in list) {
                time = timeConverter(list[id].createdAt);
                if (list[id].id == user.id) {
                    msg = "You: " + list[id].msg;
                } else {
                    msg = list[id].msg;
                }
            }
            $('#results').append(generateBlockListChat(mode, id, avt, name, time, msg));
        }
    });
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
    $(".closenewmsg").click(function() {
        // $(".welcome").attr("style", "display:none;")
        $(".content-right-newmsg").attr("style", "display:none;")
        $("#newmsg").attr("style", "display:none;")
        $(".welcome").attr("style", "display:block;")
    });
});