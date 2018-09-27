$(function() {
    $(".registbutton").click(function() {
        var username = $("input[name=username]").val().trim();
        var password = $("input[name=password]").val().trim();
        var password1 = $("input[data-name]").val().trim();
        var mobile = $("input[name=mobile]").val().trim();
        var vCode = $("input[name=vCode]").val().trim();

        if (username.length == 0) {
            mui.toast("请输入用户名");
        }

        if (password.length == 0) {
            mui.toast("请输入密码");
        }

        if (password1.length == 0) {
            mui.toast("请再次输入密码");
        }

        if (password !=password1) {
            mui.toast("两次密码不一致，请重新输入");
        }

        if (mobile.length == 0) {
            mui.toast("请输入手机号");
        }

        if (vCode.length == 0) {
            mui.toast("请输入验证码");
        }

        if(!$(".items input[type=checkbox]").prop("checked")){
            mui.toast("你还没有同意我们的协议");
        } 

        //开始发起ajax请求来注册新用户
        $.ajax({
            url: "/user/register",
            type: "POST",
            data: $("form").serialize(),
            success: function(data) {
                console.log(data);
                if (data.success) {
                    window.location.href = "login.html?type=regist";
                }
            }
        });

        // var obj = {username:username, password:password, psssword1:password1, mobile: mobile, vCode: vCode};
        // console.log(obj);
    });

    //发送验证码
    $(".sendcodebutton").click(function() {
        //修改button的样式
        $(this).addClass("disabled").prop("disabled", true).text("正在发送中...");

        var count = 5;
        //开启定时器，实现倒计进
        var timer = setInterval(function(){
            count -= 1;
            var str = count+"秒后再次发送";
            //每秒钟改变一下button里面的文字
            $(".sendcodebutton").text(str);

            if (count <= 0) {
                //当倒计时结束，把button还原到可以点击的状态
                $(".sendcodebutton").removeClass("disabled").prop("disabled", false).text("获取验证码");

                //清空定时器
                window.clearInterval(timer);
            }
        }, 1000);

        //发起ajax请求，获取验证码
        $.ajax({
            url: "/user/vCode", 
            type: "GET",
            data: {},
            success: function(data) {
                //console.log(data);
                var code = data.vCode;

                //设置验证码
                $("input[name=vCode]").val(code);
            }
        });
    });

});