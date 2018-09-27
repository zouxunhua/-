$(function(){
    //每个a点击时， 处于高亮的状态， 其它的a呢，则处于非高亮状态
    $(".menu a").click(function(){
        $(".menu a").removeClass("active");
        $(this).addClass("active");
    });

    //当点击分类管理时， 那么展开折叠下拉的菜单
    $(".togglemenu").click(function(){
        $(".submenu").slideToggle();
    });

    $(".toggle-left").click(function(){
        $(".left, main").toggleClass("now");
    });
});