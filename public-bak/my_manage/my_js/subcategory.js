$(function() {
    var currentPage = 1;
    var pageSize = 5;
    function render() {
        // 获取表格数据
        $.ajax({
            type: "get", 
            url: "/category/querySecondCategoryPaging",
            data: {page: currentPage, pageSize: pageSize},
            success: function(data) {
                console.log(data);
                //1. 渲染表格
                var html = template("category", data);
                $("tbody").html(html);
                
                //2. 演染分页器
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


    //下拉框数据渲染
    function renderFirst () {
        $.ajax({
            type: "get", 
            url: "/category/queryTopCategoryPaging",
            data: {page: 1, pageSize: 100},
            success: function(data) {
                console.log(data);
                //1. 渲染表格
                var html = template("dropdown", data);
                $(".dropdown-menu").html(html);
            }
        });
    }

    renderFirst();

    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            console.log(data.result.picAddr);
            $("#brandimg").attr("src", data.result.picAddr);
            $("#brandLogo").val(data.result.picAddr);
            $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });

    //1. 拿到form表单， 需要juqery对象
    var $form = $("form");
    console.log($form);

    //添加分类
    $("#category-btn").click(function() {
        $("#subcategoryModal").modal("show");

        $("#subcategory-confirm").off("click").click(function(){
            $form.submit();
        });

        $(".dropdown").off("click", "a").on("click", "a", function() {
            $(".categoryname").html($(this).html());
            $("#brandId").val($(this).data("id"));

            //让categoryId校验成功
            $form.data("bootstrapValidator").updateStatus("brandId", "VALID");
        });

    });

    //2. 调用bootstrap的validator的方法
    $form.bootstrapValidator({
        excluded:[],

        //1. 较验成功或失败后的小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //2. 对每个字段配置较验规则
        fields: {
            //1. 字段一
            brandId: {
                validators: {
                    //1.规则一
                    notEmpty: {
                        message: "二级分类不能为空"
                    }
                }
            },

            categoryId: {
                validators: {
                    //1.规则一
                    notEmpty: {
                        message: "一级分类不能为空"
                    }
                }
            },

            brandLogo:{
                validators:{
                  notEmpty:{
                    message:"请上传图片"
                  }
                }
              },
        }
    }).on('success.form.bv', function (e) {
        //较验成功之时，默认表单会提交，所以先阻止默认事件，再用ajax提交表单
        e.preventDefault();
        //使用ajax提交逻辑
        /*获取当前的表单*/
        var $form = $(e.target);

        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data:$form.serialize(),
            success: function(data) {

                console.log(data);
                //1. 渲染表格
                var html = template("dropdown", data);
                $(".dropdown-menu").html(html);

                //关闭模态框
                $("#subcategoryModal").modal("hide");

                currentPage = 1;
                render();

                //把表单还原
                $form.data("bootstrapValidator").resetForm();
                $form[0].reset();
                $(".categoryname").text("请选择一级分类");
                $("#brandimg").attr("src", "images/none.png");
                $("#categoryId").val("");
                $("#brandLogo").val("");
            }
        });
    });
});






