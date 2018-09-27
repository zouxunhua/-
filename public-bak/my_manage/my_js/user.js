$(function(){
    var currentPage = 1;
    var pageSize = 5;

    function render() {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {page: currentPage, pageSize: pageSize},
            success: function(data){
                //渲染table
                console.log(data);
                var userHtml = template("usertable", data);
                $("tbody").html(userHtml);

                //渲染分页器
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage: currentPage,//指定当前页
                    totalPages: Math.ceil(data.total / pageSize),//指定总页数
                    size: "small",//设置控件的大小
                    onPageClicked: function (a, b, c, page) {
                      //page指的是点击的页码,修改了当前页
                      currentPage = page;
                      //重新渲染
                      render();
                    }
                });
            }
        });
    }

    render();

    $(".users-table").on("click", ".btn", function(){
        //弹出模态框
        $("#userModal").modal("show");

        var id = $(this).parent().parent().data("id");
        var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
        console.log(id);

        $(".btn_edit").off("click").on("click", function() {
            $.ajax({
                type: "post",
                url: "/user/updateUser",
                data: {id: id, isDelete: isDelete},
                success: function(response) {
                    if(response.success) {
                        $("#userModal").modal("hide");
                        //重新渲染页面
                        render();
                    }
                }
            });
        });
    });
});