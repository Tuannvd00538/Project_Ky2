$(document).ready(function() {
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

    $('.helloname').text(user.fullname);

    function getChat() {
        var id = $('.active').attr('data-id');
        var mode = $('.active').attr('data-mode');
        var iSilent = new Firebase('https://i-silent.firebaseio.com/');
        iSilent.child("messages/" + mode + "/" + id).on('child_added', function(snapshot) {
            var message = snapshot.val();
            var you = {};
            $.get("/avatar/" + message.id, function(avt) {
                if (message.id == user.id) {
                    $('#resultsChat').append(generateBlockMeChat(message.msg));
                    $('.msg').text("You: " + message.msg);
                } else {
                    $('#resultsChat').append(generateBlockYouChat(avt, message.msg));
                    if (!you.hasOwnProperty(message.id)) {
                        $.ajax({
                            url: "/info/" + message.id,
                            headers: {
                                "Authorization": token
                            },
                            type: "GET",
                            success: function(data) {
                                $('.username span').text(data.fullname);
                                $('.chatname').text(data.fullname)
                                $('.actionname').text(data.fullname);
                                $('.rsAvt').attr('src', data.avatar);
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
                    $('.msg').text(message.msg);
                }
            });
            $('.chatbox').animate({
                scrollTop: $('.chatbox').get(0).scrollHeight
            }, 0)
        });
    }
    getChat();
    $('input[name=message]').keyup(function(e) {
        if (e.keyCode == 13 && $(this).val().length != 0) {
            var data = {
                id: user.id,
                msg: $(this).val(),
                idChat: $('.active').attr('data-id')
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
    $('.chatbox').animate({
        scrollTop: $('.chatbox').get(0).scrollHeight
    }, 0);
    Notification.requestPermission(function(e) {
        if (e !== 'denied') {
            console.log('Notification', 'Accept');
        }
    });


    $(".newmsg-icon").click(function(event) {
        $(".content-right").attr("style","display:none;")
        $(".content-right-newmsg").attr("style","display:block;")
        $(".welcome").attr("style","display:none;")
        $("#newmsg").attr("style","display:block;")
    });

    $("#results").click(function(event) {
        $(".content-right").attr("style","display:block;")
        $(".welcome").attr("style","display:none;")
        $("#newmsg").attr("style","display:none;")
    });
});
