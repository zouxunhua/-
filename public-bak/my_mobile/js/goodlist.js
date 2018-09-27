$(function(){
    //添加搜索记录
    function addsearchlist (key) {
        var listarr = getsearchlist();
        listarr.push(key);
        var liststr = JSON.stringify(listarr);
        localStorage.setItem("lt-search", liststr);
    }

    //获取搜索记录， 渲染搜索记录列表
    function getsearchlist() {
        var list = window.localStorage.getItem("lt-search");
        var listarr = !list ? [] : JSON.parse(list)
        return listarr;
    }

    //开始联网请求
    function search() {
        var currentPage = 1;
        var pageSize = 100;
        var params = {};

        //键
        var key = window.sessionStorage.getItem("search-key");
        params.proName = key;
        params.page = currentPage;
        params.pageSize = pageSize;

        //拿到排序的key
        var type = $(".lt-sort a[data-type].ocolor").data("type");

        if (type) {
            console.log($(".lt-sort a.ocolor span"));
            console.log($(".lt-sort a.ocolor span").attr("class"));
            //拿到排序的value
            var value = $(".lt-sort a.ocolor span").hasClass("fa-angle-up")?2:1;
            console.log(value);
            params[type] = value;
        }

        $.ajax({
            type: "get",
            url: "/product/queryProduct",
            data: params,
            success: function (response) {
                var html = template("goodlist", response);
                $(".lt-home-goods").html(html);
            }
        });
    }

    search();

    //点击搜索按钮
    $(".search-button").click(function() {
        //1. 保存搜索记录
        $key = $("#searchinput").val();
        // console.log($key);
        addsearchlist($key);

        //先保存到sessionStorage中
        window.sessionStorage.setItem("search-key", $key);

        search();
    });

    $(".lt-sort").on("click", "a", function(){
        $(this).addClass("ocolor");
        $(this).siblings().removeClass("ocolor");

        $span = $(this).children("span");

        if ($span.hasClass("fa-angle-down")) {
            $span.removeClass("fa-angle-down").addClass("fa-angle-up");

        } else {
            $span.removeClass("fa-angle-up").addClass("fa-angle-down");
        }

        search();
    });
});