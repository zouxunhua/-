$(function() {
    var url = window.location.href;
    var data = urlTool(url);
    console.log(data);

    function render(data) {
        $.ajax({
            url: "/product/queryProductDetail",
            type: "GET",
            data: data,
            success: function(response) {
                console.log(response);
                //获取并渲染图片数据
                var html = template("banner", response);
                //alert(html);
                $(".mui-slider").html(html);

                var gallery = mui('.mui-slider');
                gallery.slider({
                interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
                });

                var detailHtml = template("detail", response);
                $(".detail").html(detailHtml);

                //页面滑动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });

                //设置文字输入框的数值
                mui(".mui-numbox").numbox().setValue(1);

                //得到尺码的区间
                var size = response.size.split("-")[0];


            }
        })
    }

    //注册事件
    $(".detail").on("click", ".size span", function() {
        //让该尺码高亮
        $(this).addClass("active").siblings().removeClass("active");

        //拿到尺码
        size = $(this).html();
    });

    $(".mui-btn-danger").click(function() {
        var num = mui(".mui-numbox").numbox().getValue()
        var addData = {"productId": data.id, size: size, num: num};
        console.log(addData);
        addToCar(addData);
    });

    render(data);

    //加入购物车
    function addToCar(parmas) {
        $.ajax({
            url: "/cart/addCart",
            type: "POST",
            data: parmas,
            success: function(response) {
                console.log(response);
            }
        });
    }
});