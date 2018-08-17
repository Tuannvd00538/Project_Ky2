$(document).ready(function() {
    $.ajax({
        url: "/list" + window.location.pathname + "?me=" + user.id,
        headers: {
            "Authorization": token
        },
        type: "GET",
        success: function(data) {
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
    iSilent.child("messages" + window.location.pathname + "/messages").on('child_added', function(snapshot) {
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
                            "Authorization": token
                        },
                        type: "GET",
                        success: function(data) {
                            $('.username span').text(data.fullname);
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
            }
            $('.loading').attr('style', 'display:none;');
        });
    });
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
                    window.location.href = resultData;
                }
            });
            $(this).val("");
        }
    });
    $('input[name=messageNewGr]').keyup(function(e) {
        if (e.keyCode == 13 && $(this).val().length != 0) {
            var listChat = [];
            $.map($(".tagsinput span span"), function(e, i) {
                listChat.push($(e).text().trim());
            });
            console.log(listChat);
        }
    });
});