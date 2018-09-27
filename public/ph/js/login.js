$(function() {
    $(".mui-btn-primary").click(function() {
        //表单验证
        var username = $("input[name=username]").val();
        var password = $("input[name=password]").val();

        if (username.trim().length == 0) {
            mui.toast('请输入用户名');
            return;
        }

        if (password.trim().length == 0) {
            mui.toast("请输入密码");
            return;
        }

        //发起ajax开始登录
        $.ajax({
            url: "/user/login",
            type: "POST",
            data: $("form").serialize(),
            success: function(data) {
                //console.log(data);
                if (data.success) {
                    //如果是从注册页面跳过来的，那么登录成功之后，就不再跳回了，而是跳到个人中心页面
                    var obj= urlTool(window.location.href);
                    console.log(obj);
                    if (obj.type == "regist") {
                        window.location.href = "user.html";
                    } else {
                        //回到上一个页面
                        window.history.back();
                    }
                }
            }
        });
    });
})