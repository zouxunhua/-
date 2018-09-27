$(function(){
    //第几页和每一页显示几条数据
    var page = 1;
    var pageSize = 10;

    var key = window.sessionStorage.getItem("lt-key");

    //说明是从其它地方跳过来的
    if (key) {
        $(".searchbar input").val(key);
        //发起网络请求来获取数据， 渲染数据
        var data = {proName: key, page: page, pageSize: pageSize};
        render(data);
    }

    //点击搜索按钮发起请求获取并渲染数据
    $(".searchbutton").click(function(){
        key = $(".searchbar input").val();
        var data = {proName: key, page: page, pageSize: pageSize};
        render(data);
    });

    function render(data) {
        $(".loading").show();
        $.ajax({
            url: "/product/queryProduct",
            type: "GET",
            data: data,
            success: function (response) { 
                setTimeout(function(){
                    $(".loading").hide();
                }, 1000);
                console.log(response);
                var html = template("products", response);
                $(".products").html(html);
            }
        })
    }

    $(".sort a").click(function() {
        var data = {proName: key, page: page, pageSize: pageSize};
        var type = $(this).data("type");

        //如果a不是激活状态，就设为激活状态,此时不需要改变箭头的方向，也无需发起请求
        if (!$(this).hasClass("active")) {
            $(this).addClass("active").siblings().removeClass("active");
        } 
        //如果a已经是激活状态就改变箭头的方向，并且发起请求
        else {
            if($(this).find(".fa").hasClass("fa-angle-down")) {
                $(this).find(".fa").removeClass("fa-angle-down").addClass("fa-angle-up");
                //此时箭头向上，是升序
                data[type]=1;
            } else {
                $(this).find(".fa").addClass("fa-angle-down").removeClass("fa-angle-up");
                //此时箭头向下，是降序
                data[type]=2;
            }
        }

        //console.log(data);
        render(data);
    });
});