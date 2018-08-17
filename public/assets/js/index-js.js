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

Notification.requestPermission(function(e) {
    if (e !== 'denied') {
        console.log('Notification', 'Accept');
    }
});

function logout() {
    localStorage.clear();
    window.location = '/login';
}
function generateBlockAddChat(id, avatar, name) {
    var output = "";
        output += '<a href="javascript:createMsg(\'' + id + '\', \'' + avatar + '\', \'' + name + '\')" class="media">';
            output += '<div class="media-left">';
                output += '<img class="media-object" src="' + avatar + '"/>';
            output += '</div>';
            output += '<div class="media-body">';
                output += '<h4 class="media-heading">' + name + '</h4>';
            output += '</div>';
        output += '</a>';
    return output;
}

function generateBlockGrChat(id, avatar, name) {
    var output = "";
        output += '<a href="javascript:createGrMsg(\'' + id + '\', \'' + avatar + '\', \'' + name + '\')" class="media">';
            output += '<div class="media-left">';
                output += '<img class="media-object" src="' + avatar + '"/>';
            output += '</div>';
            output += '<div class="media-body">';
                output += '<h4 class="media-heading">' + name + '</h4>';
            output += '</div>';
        output += '</a>';
    return output;
}

function createMsg(id, avatar, name) {
    $('.avtNew').attr('src', avatar);
    $('.nameNew').text(name);
    $('.rsNameNew').text('Tin nhắn mới đến ' + name);
    $('.rsAddChat').attr('style', 'display:none;');
    $('.mainNew').attr('style', 'display:block;');
    $('input[name=addChat]').val(name);
    $('input[name=messageNew]').attr('data', id);
}

function createGrMsg(id, avatar, name) {
    $('.nameNew').text(name);
    $('.rsNameNew').text('Cuộc trò chuyện nhóm của ' + user.fullname);
    $('.rsAddChat').attr('style', 'display:none;');
    $('input[name=addChatGr]').val($('input[name=addChatGr]').val().replace(id, name + ', '));
    $('input[name=messageNewGr]').attr('data', id);
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
$(document).ready(function() {
    $('.inputName div input').attr('value',user.fullname);
    $('.myAvatar img').attr('src',user.avatar);
    $('.helloname').text(user.fullname);
    $(".closenewmsg").click(function() {
        window.history.back();
    });
    $('input[name=addChat]').keyup(function (e) {
        if (e.keyCode == 13 && $(this).val().length != 0) {
            if (isNumeric($(this).val())) {
                if ($(this).val() != user.id) {
                    $('.rsAddChat').attr('style', 'display:block;');
                    $('.rsAddChat').html('<div class="spinnerAdd"></div>');
                    $.ajax({
                        url: "/search/user/" + $(this).val(),
                        headers: {
                            "Authorization": token
                        },
                        type: "GET",
                        success: function(data) {
                            if (data.code == undefined) {
                                $('.rsAddChat').html(generateBlockAddChat(data.id, data.avatar, data.fullname));
                            } else {
                                $('.rsAddChat').html('<p class="nullSearch">Không có kết quả tìm kiếm!</p>');
                            }
                        }
                    });
                } else {
                    $('.rsAddChat').attr('style', 'display:block;');
                    $('.rsAddChat').html('<p class="nullSearch">Bạn không thể chat với chính mình!</p>');
                }   
            } else {
                alert('Vui lòng nhập id hợp lệ!');
            }
        }
        if ($(this).val().length == 0) {
            $('.rsAddChat').attr('style', 'display:none;');
        }
    });
    if (chatlist != null || chatlist != undefined) {
        for (var id in chatlist) {
            $.ajax({
                url: "/list/" + chatlist[id] + "/" + id + "?me=" + user.id,
                async: false,
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
                    $('#results').prepend(generateBlockListChat(mode, id, avt, name, time, msg));
                }
            });
        }
    } else {
        $('.noChat').attr('style', 'display:block;');
    }
});