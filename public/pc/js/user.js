$(function(){
    //当前加载的哪一页
    var page = 1;
    //每一页显示几条
    var pageSize = 5;

    function render() {
        $.ajax({
            url:"/user/queryUser",
            type: "GET",
            data: {page: page, pageSize: pageSize},
            success: function(data) {
                console.log(data);
                //使用数据，生成表格里面的html
                var html = template("user-table", data);
                //把生成的html字符串塞到tbody中
                $("tbody").html(html);
    
                //分页插件需要ajax完成之后，获取到数据之后来调用
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage: page,//指定当前页
                    totalPages: Math.ceil(data.total / pageSize),//指定总页数
                    size: "small",//设置控件的大小
    
                    //当点击分页组件按钮会调用该方法
                    //index参数，就代表当前点击的是第几页
                    onPageClicked: function (a, b, c, index) {
                      //page指的是点击的页码,修改了当前页
                      page = index;
    
                      //每一次点击都会去发起ajax请求，获取数据，渲染数据
                      render();
                    }
                });
            }
        });
    }

    //首次获取数据
    render();

    //更新用户的状态
    function updateuser(id, isDelete) {
        $.ajax({
            url: "/user/updateUser",
            type: "POST",
            data: {id: id, isDelete: isDelete},
            success: function(data) {
                render();
            }
        });
    }

    //实现更新用户状态的功能
    $("tbody").on("click", "button", function () { 
        //判断当前点击的是禁用，还是启用
        var id = $(this).data("id");
        // alert(id);

        //禁用
        if ($(this).hasClass("btn-danger")) {
            updateuser(id, 0);
        }

        //启用
        if($(this).hasClass("btn-success")) {
            updateuser(id, 1);
        }
     });
});