$(function(){
    //第几页和每一页显示几条数据
    var page = 1;
    var pageSize = 10;

    //拿到当前页面地址
    var href = window.location.href;

    //把地址中的参数拿到,得到一个对象，作为ajax请求的对象
    var data = urlTool(href);

    //设置页数
    data.page = page;
    data.pageSize = pageSize;

    //首次进入页面发起网络请求
    render(data);

    //点击搜索按钮发起请求获取并渲染数据
    $(".searchbutton").click(function(){
        //点击搜索，传的是brandName而不是brandId
        delete data.brandId;
        data.brandName=$(".searchbar input").val();
        render(data);
    });

    //获取并渲染数据
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
                var html = template("products", response);
                $(".products").html(html);
            }
        })
    }

    //点击排序
    $(".sort a").click(function() {
        var type = $(this).data("type");

        //如果a不是激活状态，就设为激活状态,此时不需要改变箭头的方向，也无需发起请求
        if (!$(this).hasClass("active")) {
            $(this).addClass("active").siblings().removeClass("active");
        } 

        //如果a已经是激活状态就改变箭头的方向
        else {
            if($(this).find(".fa").hasClass("fa-angle-down")) {
                $(this).find(".fa").removeClass("fa-angle-down").addClass("fa-angle-up");
            } else {
                $(this).find(".fa").addClass("fa-angle-down").removeClass("fa-angle-up");
            }
        }

        //点击之后要发起请求，重新做排序
        //如果type有值，说明点击的是库存和价格的a标签，那么就需要发起网络请求
        if (type) {
            //参数问题
            //不管点的任何一个，先把num(库存)和price(价格)这两个参数先删除掉
            delete data.num;
            delete data.price;

            if($(this).find(".fa").hasClass("fa-angle-down")) {
                data[type] = 2;
            } else {
                data[type] = 1;
            }
            render(data);
        }

    });

    //点击购买按钮，跳到到商品详细页
    $(".products").on("click", ".buybutton", function() {
        var id = $(this).data("id");
        window.location.href = "product.html?id="+id;
    })
});