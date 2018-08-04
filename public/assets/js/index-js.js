$(document).ready(function() {
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
    $('.chatbox').animate({
        scrollTop: $('.chatbox').get(0).scrollHeight
    }, 0);
    var chatlist = user.chatlist;
    for (var id in chatlist) {
        console.log('id' + id + ' has value ' + chatlist[id]);
    }

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
                } else {
                    $('#resultsChat').append(generateBlockYouChat(avt, message.msg));
                    if (!you.hasOwnProperty(message.id)) {
                        $.ajax({
                            url: "/info/" + message.id,
                            headers: {
                                "Authorization": user.token
                            },
                            type: "GET",
                            success: function(data) {
                                $('.username span').text(data.fullname);
                                $('.chatname').text(data.fullname)
                                $('.actionname').text(data.fullname);
                                $('.rsAvt').attr('src', data.avatar);
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
        if (e.keyCode == 13) {
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
                    "Authorization": user.token
                },
                success: function(resultData) {
                }
            });
            $(this).val("");
        }
    });
});