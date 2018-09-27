//在页面中，所有的ajax请求开始时，会调用该方法
$(document).ajaxStart(function() {
    NProgress.configure({minimum:0.3});
    //让菊花停止转动
    NProgress.configure({ showSpinner: false });
    NProgress.start();
});

//在页面中，所有的ajax，如果它已经成功，或终止了，就会调用该方法
$(document).ajaxStop(function() {
    // alert("ajax请求完成");
    // 这个地方加个延迟500毫秒是因为我们是本地操作，速度比较快，为了演示效果的。如果说在工作中，真实的环境，速度是很慢的，就不需要加500毫秒的延迟了
    setTimeout(function() {
        // NProgress.set(0.4);
        // NProgress.inc(); 
        NProgress.done();
        // NProgress.remove(); //移动进度条
    }, 500);
});

$(function() {
    $(".menu a").click(function() {
        //先把别的a的高亮效果干掉
        //再给当前点击的这个a添加高亮效果
        $(this).addClass("active");
    });
    
    $(".togglesubmenu").click(function() {
        $(".submenu").slideToggle();
    });

    $(".toggle-left").click(function() {
        //1. 让左侧的菜单栏隐藏
        //2. 让右边的内容区域全屏显示

        // $(".left").animate({left: -180});
        $(".left, .main").toggleClass("now");
    });

    //右侧按钮点击时， 弹出是否注销的模态框
    $(".log-out").click(function() {
        $("#logout-modal").modal("show");

        //给确定按钮添加事件
        // $("#logout-modal").on("click", ".btn-primary", function() {
        //     console.log("退出登录");
        // });

        //每一次进入模态框，先把绑定的事件清除掉，再重新绑定事件， 这样的里面的执行代码只会调用一次
        $("#logout-modal .btn-primary").off("click").on("click", function () { 
            //console.log("退出登录");
            $.ajax({
                url: "/employee/employeeLogout",
                type: "GET",
                data: {},
                success: function(data) {
                    //说明注销成功了{success: true}
                    if (data.success) {
                        window.location.href = "login.html";
                    }
                }
            });
        });
    });



    //检查用户是否登录
    $.ajax({
        url: "/employee/checkRootLogin",
        type: "GET",
        data: {},
        success: function(data) {
            console.log(data);
            //{"error":400,"message":"未登录！"}
            if (data.error) {
                //在跳转之前，使用sessionstorage来把当前页面的地址保存起来。
                window.sessionStorage.setItem("href", window.location.href);
                //说明未登录
                window.location.href = "./login.html";
            }
        }
    });
});