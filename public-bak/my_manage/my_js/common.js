NProgress.configure({
    showSpinner: false
});

$(window).ajaxStart(function() {
    NProgress.start();
});

$(window).ajaxStop(function() {
    NProgress.done();
});

$(".child").prev().on("click", function() {
    console.log($(this));
    $(this).next().slideToggle();
});

$(".index-body .aside .menu li a").on("click", function() {
    $(".index-body .aside .menu li a").removeClass("active");
    $(this).toggleClass("active");
});

$("a[data-menu]").on("click", function() {
    $(".aside, .main").toggleClass("now");
});

$("a[data-logout]").on("click", function() {
    $('#logoutmodel').modal();
    $("#logout-confirm").off("click").click(function(){
        console.log("hello");
        $.ajax({
            type:'get',
            url:'/employee/employeeLogout',
            data:{},
            dataType:'json',
            success:function(data){
                setTimeout(function(){
                    if(data.success){
                        /*7.退出成功*/
                        location.href = 'login.html';
                    }
                },500);
            }
        });
    });
});
