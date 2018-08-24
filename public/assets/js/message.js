var user = JSON.parse(localStorage.getItem('user'));
var token = user.token;

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
function generateBlockMember(name, avatar) {
    var output = "";
        output += '<div class="col-md-2 avatar-mem nopadding">';
            output += '<img src="' + avatar + '">';
        output += '</div>';
        output += '<div class="col-md-10 name-mem">' + name + '</div>';
    return output;
}
$(document).ready(function() {
    $.ajax({
        url: "/list" + window.location.pathname + "?me=" + user.id,
        headers: {
            "Authorization": token
        },
        type: "GET",
        success: function(data) {
            $('.username').text(data.fullname);
            $('.actionname').text(data.fullname);
            $('.rsAvt').attr('src', data.avatar);
        }
    });
    $('input[name=message]').keyup(function(e) {
        if (e.keyCode == 13 && $(this).val().length != 0) {
            var data = {
                id: user.id,
                msg: $(this).val(),
                idChat: $(this).attr('data')
            }
            $.ajax({
                type: 'POST',
                url: "/sendmsg",
                data: data,
                headers: {
                    "Authorization": token
                },
                success: function(resultData) {}
            });
            $(this).val("");
        }
    });
    var iSilent = new Firebase('https://i-silent.firebaseio.com/');
    var strUrl = window.location.pathname;
    iSilent.child("messages" + window.location.pathname + "/messages").on('child_added', function(snapshot) {
        var message = snapshot.val();
        var you = {};
        $.get("/avatar/" + message.id, function(info) {
            $('.chatbox').animate({
            scrollTop: $('.chatbox').get(0).scrollHeight},0);
            $('a[href$="' + window.location.pathname  +'"] .name-contact').addClass('active');
            if (strUrl.includes("group")) {
                if (message.id == user.id) {
                    $('.membergroup').attr('style','display: block');
                    $('.action-right').attr('style','border-bottom: 1px solid rgba(0, 0, 0, .10)');
                    $('.avatar').attr('style','text-align: center');
                    $('#resultsChat').append(generateBlockMeChat(message.msg));
                    if((message.msg).indexOf('chatImg') == -1) {
                        $('#results p.' + (window.location.pathname).replace('/single/', '').replace('/group/', '')).html(message.msg);
                        $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').attr('style','font-weight:0;');
                        $('a[href$="' + window.location.pathname + '"] .name-contact .msg').attr('style','color:none;font-weight:0;');
                    }
                    else {
                        message.msg = 'Bạn đã gửi một ảnh !';
                        $('#results p.' + (window.location.pathname).replace('/single/', '').replace('/group/', '')).html('Bạn: ' + message.msg);
                        $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').attr('style','font-weight:0;');
                        $('a[href$="' + window.location.pathname + '"] .name-contact .msg').attr('style','color:none;font-weight:0;');
                    }                
                } else {
                    $('#resultsChat').append(generateBlockYouChatGr(info.avatar, message.msg, info.fullname));
                    if (!you.hasOwnProperty(message.id)) {
                        $.ajax({
                            url: "/info/" + message.id,
                            headers: {
                                "Authorization": token
                            },
                            type: "GET",
                            async: false,
                            success: function(data) {
                                if((message.msg).indexOf('chatImg') == -1) { 
                                    $('#results p.' + (window.location.pathname).replace('/single/', '').replace('/group/', '')).html(message.msg);
                                    $('.username span').text(data.fullname);
                                    $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').attr('style','font-weight:bold;');
                                    $('a[href$="' + window.location.pathname + '"] .name-contact .msg').attr('style','color:black;font-weight:500;');
                                }
                                else{
                                    message.msg = $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').text() + ' đã gửi một ảnh !';
                                    $('#results p.' + (window.location.pathname).replace('/single/', '').replace('/group/', '')).html(message.msg);
                                    $('.username span').text(data.fullname);
                                    $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').attr('style','font-weight:bold;');
                                    $('a[href$="' + window.location.pathname + '"] .name-contact .msg').attr('style','color:black;font-weight:500;');
                                }
                                // thông báo đẩy
                                // if (Notification.permission != 'default') {
                                //     notify = new Notification('ChatHub ❤', {
                                //         body: data.fullname + ': ' + message.msg,
                                //         icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y4/r/2PivRVKESq2.png',
                                //         tag: 'http://localhost:8080/'
                                //     });
                                //     notify.onclick = function() {
                                //         window.location.href = this.tag;
                                //     }
                                // }
                            }
                        });
                        you[message.id] = true;
                    }
                }
                $('.loading').attr('style', 'display:none;');
            } else {
                if (message.id == user.id) {
                    $('.chatbox').animate({
                    scrollTop: $('.chatbox').get(0).scrollHeight},0);
                    $('#resultsChat').append(generateBlockMeChat(message.msg));
                    $('.membergroup').attr('style','display: none');
                    if((message.msg).indexOf('chatImg') == -1) {
                        $('#results p.' + (window.location.pathname).replace('/single/', '').replace('/group/', '')).html(message.msg);
                        $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').attr('style','font-weight:0;');
                        $('a[href$="' + window.location.pathname + '"] .name-contact .msg').attr('style','color:none;font-weight:0;');
                    }
                    else {
                        message.msg = 'Bạn đã gửi một ảnh !';
                        $('#results p.' + (window.location.pathname).replace('/single/', '').replace('/group/', '')).html('Bạn: ' + message.msg);
                        $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').attr('style','font-weight:0;');
                        $('a[href$="' + window.location.pathname + '"] .name-contact .msg').attr('style','color:none;font-weight:0;');
                    }                
                } else {
                    $('#resultsChat').append(generateBlockYouChat(info.avatar, message.msg));
                    if (!you.hasOwnProperty(message.id)) {
                        $.ajax({
                            url: "/info/" + message.id,
                            headers: {
                                "Authorization": token
                            },
                            type: "GET",
                            async: false,
                            success: function(data) {
                                if((message.msg).indexOf('chatImg') == -1) { 
                                    $('#results p.' + (window.location.pathname).replace('/single/', '').replace('/group/', '')).html(message.msg);
                                    $('.username span').text(data.fullname);
                                    $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').attr('style','font-weight:bold;');
                                    $('a[href$="' + window.location.pathname + '"] .name-contact .msg').attr('style','color:black;font-weight:500;');
                                }
                                else{
                                    message.msg = $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').text() + ' đã gửi một ảnh !';
                                    $('#results p.' + (window.location.pathname).replace('/single/', '').replace('/group/', '')).html(message.msg);
                                    $('.username span').text(data.fullname);
                                    $('a[href$="' + window.location.pathname + '"] .name-contact .chatname').attr('style','font-weight:bold;');
                                    $('a[href$="' + window.location.pathname + '"] .name-contact .msg').attr('style','color:black;font-weight:500;');
                                }
                                // thông báo đẩy
                                // if (Notification.permission != 'default') {
                                //     notify = new Notification('ChatHub ❤', {
                                //         body: data.fullname + ': ' + message.msg,
                                //         icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/y4/r/2PivRVKESq2.png',
                                //         tag: 'http://localhost:8080/'
                                //     });
                                //     notify.onclick = function() {
                                //         window.location.href = this.tag;
                                //     }
                                // }
                            }
                        });
                        you[message.id] = true;
                    }
                }
                $('.loading').attr('style', 'display:none;');
                $('.chatbox').animate({
                scrollTop: $('.chatbox').get(0).scrollHeight},0);
            }
        });
    });
    if (strUrl.includes("group")) {
        $.ajax({
            url: "/chat" + window.location.pathname,
            headers: {
                "Authorization": token
            },
            type: "GET",
            async: false,
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    $('.listmem').append(generateBlockMember(data[i].fullname, data[i].avatar));
                }
            }
        });
    }
    $('input[name=message]').attr('data', window.location.pathname);
    $('input[name=messageNew]').keyup(function(e) {
        if (e.keyCode == 13 && $(this).val().length != 0) {
            var data = {
                idKey: user.id,
                idClient: $(this).attr('data'),
                msg: $(this).val(),
                mode: 'single'
            }
            $.ajax({
                type: 'POST',
                url: "/createMsg",
                data: data,
                headers: {
                    "Authorization": token
                },
                success: function(resultData) {
                    $.ajax({
                        url: "/update/" + parseJwt(token).username + "/" + parseJwt(token).id,
                        headers: {
                            "Authorization": token
                        },
                        type: "GET",
                        success: function(data) {
                            localStorage.setItem('user', JSON.stringify(data));
                        }
                    });
                    window.location.href = resultData;
                }
            });
            $(this).val("");
            $('.chatbox').animate({
            scrollTop: $('.chatbox').get(0).scrollHeight},0);
        }
    });
    $('input[name=messageNewGr]').keyup(function(e) {
        if (e.keyCode == 13 && $(this).val().length != 0) {
            var listChat = [];
            $.map($(".tagsinput span span"), function(e, i) {
                listChat.push($(e).attr('data'));
            });
            var data = {
                idKey: user.id,
                listUser: JSON.stringify(listChat),
                name: 'Cuộc trò chuyện của ' + user.fullname,
                idClient: $(this).attr('data'),
                msg: $(this).val(),
                avt: 'https://cdn2.iconfinder.com/data/icons/people-groups/512/Leader_Avatar-512.png',
                mode: 'group'
            }
            $.ajax({
                type: 'POST',
                url: "/createMsgGr",
                data: data,
                headers: {
                    "Authorization": token
                },
                success: function(resultData) {
                    $.ajax({
                        url: "/update/" + parseJwt(token).username + "/" + parseJwt(token).id,
                        headers: {
                            "Authorization": token
                        },
                        type: "GET",
                        success: function(data) {
                            localStorage.setItem('user', JSON.stringify(data));
                        }
                    });
                    window.location.href = resultData;
                }
            });
        }
    });
});