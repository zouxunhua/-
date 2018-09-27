function urlTool(url) {
    //把数组的最后一个元素弹出并返回
    var params = url.split("?").pop().split("&");

    var paramObj = {};
    params.forEach(function (obj) { 
        // console.log(obj);
        var kv = obj.split("=");
        //console.log(kv);
        paramObj[kv[0]] = kv[1];
    });

    return paramObj;
}

function checkLogin(data) {
    if (data.error == 400) {
        //说明在调用某个接口返回数据时没有登录， 就跳转到登录页面
        window.location.href = "login.html";
    }
}

$(function() {
    //所有header上的小房子图标点击回到主页
    $("header .fa.fa-home").click(function() {
        window.location.href = "index.html";
    });
    
    $("header .mui-icon-back").click(function() {
        // alert("哈哈哈");
        //回到上一个页面
        window.history.back();
    });
});
