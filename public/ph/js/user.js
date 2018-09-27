$(function() {
    $.ajax({
        url: "/user/queryUserMessage",
        type: "GET",
        data: {},
        success: function(data) {
            console.log(data);
            //检查是否登录，如是没有登录，就跳转到登录页
            checkLogin(data);
            //渲染登录数据
            var html = template("userinfo", data);
            $(".user").html(html);

            $(".user").off("click", ".logout button").on("click", ".logout button", function() {
                // alert("注销");
                $.ajax({
                    url: "/user/logout",
                    type: "GET",
                    data: {},
                    success: function(data) {
                        //注销成功之后，跳到登录页面
                        if (data.success) {
                            window.location.href = "login.html";
                        }
                    }
                });
            });
        }
    });
});