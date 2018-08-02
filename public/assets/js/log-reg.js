$(document).ready(function() {
    var user = localStorage.getItem('user');
	if (user != null || user != undefined) {
		window.location = '/';
	}
    $('#signForm').submit(function(event) {
    	event.preventDefault();
        var username = $('#usernameS').val();
        var password = $('#passwordS').val();
        var fullname = $('#fullnameS').val();
        var birthday = $('#birthdayS').val();
        var email = $('#emailS').val();
        var gender = $('input[name=gender]:checked').val();
        var validateEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        if (username.length == 0) {
            alert('Bạn chưa nhập username!');
        } else if (username.length < 5) {
            alert('Username phải lớn hơn 5 ký tự!');
        } else {
            // TODO
        }
        if (password.length == 0) {
            alert('Bạn chưa nhập mật khẩu!');
        } else if (password.length < 5) {
            alert('Mật khẩu phải lớn hơn 5 ký tự!');
        } else {
            // TODO
        }
        if (fullname.length == 0) {
        	alert('Bạn chưa nhập họ tên!');
        }
        if (email.length == 0) {
            alert('Bạn chưa nhập email!');
        } else if (!validateEmail.test(email)) {
            alert('Email chưa đúng định dạng!');
        } else {
            // TODO
        }
        var sign = {
            "username": username,
            "password": password,
            "email": email,
            "fullname": fullname,
            "birthday": birthday,
            "gender": gender
        }
        if (username.length > 4 && password.length > 4 && validateEmail.test(email) == true) {
        	$.get("/create?q=" + username, function(data){
		        if (data) {
		        	$.ajax({
		                url: '/create',
		                type: "POST",
		                data: sign,
		                success: function(response) {
		                	if (response.code == undefined) {
		                		var login = {
			                        "username": username,
			                        "password": password
			                    }
			                    alert('Đăng ký thành công!');
			                    $.ajax({
			                        url: '/login',
			                        type: "POST",
			                        data: login,
			                        success: function(response) {
				                        localStorage.setItem('user', JSON.stringify(response));
				                        setTimeout(function() {
				                            window.location = '/';
				                        }, 2000);
			                        },
			                        error: function(jqXHR, textStatus, errorThrown) {
			                            console.log('error', jqXHR.responseJSON.message);
			                        }
			                    });
		                	} else {
		                		alert('Có lỗi xảy ra!');
		                	}
		                },
		                error: function(jqXHR, textStatus, errorThrown) {
		                    console.log('error', jqXHR.responseJSON.message);
		                }
		            });
		        } else {
		        	alert('Duplicate username');
		        }
		    });
        }
    });
    $("#loginForm").submit(function(event) {
        event.preventDefault();
        var username = $('#usernameL').val();
        var password = $('#passwordL').val();
        if (username.length == 0) {
            alert('Bạn chưa nhập username!');
        } else if (username.length < 5) {
            alert('Username phải lớn hơn 5 ký tự!');
        } else {
            // TODO
        }
        if (password.length == 0) {
            alert('Bạn chưa nhập mật khẩu!');
        } else if (password.length < 5) {
            alert('Mật khẩu phải lớn hơn 5 ký tự!');
        } else {
            // TODO
        }
        var login = {
            "username": username,
            "password": password
        }
        if (username.length > 4 && password.length > 4) {
            $.ajax({
                url: '/login',
                type: "POST",
                data: login,
                success: function(response) {
                    if (response.code == undefined) {
                        alert('Đăng nhập thành công!');
                        localStorage.setItem('user', JSON.stringify(response));
                        setTimeout(function() {
                            window.location = '/';
                        }, 2000);
                    } else {
                        alert('Tài khoản hoặc mật khẩu không chính xác!');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    swal("Lỗi", jqXHR.responseJSON.message, "error");
                }
            });
        };
    });
});