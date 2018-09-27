$(function(){
    var goodid = window.sessionStorage.getItem("lt-goodid");
    var goodid = "1";

    //渲染
    function render() {


        //2. 发送ajax请求，获取商品详情
        $.ajax({
            type:"get",
            url:"/product/queryProductDetail",
            data:{id:goodid},
            success:function (data) {
                console.log(data);
                $(".mui-scroll").html(template("product", data) );
        
                //渲染完成后，需要重新初始化轮播图
                mui(".mui-slider").slider({
                  interval:1000
                });
        
                // //注册事件，选择尺码
                $("a.size span").click(function() {
                    $(this).addClass("now").siblings().removeClass("now");
                });
        
                // //手动初始化数字框
                mui(".mui-numbox").numbox();
            }
        })
    }

    //渲染数据
    render();

    //添加到购物车
    $(".mui-btn-danger").click(function() {
        addToCar();
    });

    //加入购物车
    function addToCar() {
        //尺码
        var size = $("a.size span").html();
        if(!size){
            mui.toast("请选择商品的尺码");
            return false;
        }

        //库存
        var num = $(".mui-numbox-input").val();

        //发起ajax请求
        $.ajax({
            type: "post",
            url: "/cart/addCart",
            data: {
                productId: goodid,
                size: size,
                num: num
            },
            success: function (data) {
                if (data.success) {
                    //添加成功
                    mui.confirm("添加商品成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
                        if (e.index === 0) {
                            location.href = "cart.html";
                        }
                    });
                } else if(data.error === 400) {
                    //未登录
                    alert("to");
                    location.href = "login.html";
                }
            }
        });
    }
});