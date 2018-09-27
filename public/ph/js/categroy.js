$(function(){
    //获取并渲染一级分类数据
    function renderCategory() {
        $.ajax({
            url: "/category/queryTopCategory",
            type: "GET",
            data: {},
            success: function(data) {
                console.log(data);
                var html = template("category", data);
                $(".lt-category .left ul").html(html);

                //首次渲染二级分类数据
                var id = $(".left li.active").eq(0).data("id");
                console.log(id);
                renderSubcategory(id);
            }
        });
    }

    renderCategory();

    //获取并渲染二级分类数据
    function renderSubcategory(id) {
        $.ajax({
            url: "/category/querySecondCategory",
            type: "GET",
            data: {id: id},
            success: function(data) {
                console.log(data);
                var html = template("subCategory", data);
                $(".lt-category .right ul").html(html);
            }
        });
    }

    //当点左侧的li标签时， 渲染出对应的一级分类下的二级分类数据
    $(".left").on("click", "li", function() {
        var id = $(this).data("id");
        $(this).addClass("active").siblings().removeClass("active");
        renderSubcategory(id);
    });

    //当点击二级分类的图标时，跳到商品页面
    $(".right").on("click", "li", function() {
        var id = $(this).data("id");
        window.location.href = "searchlist.html?brandId="+id;
    });
});