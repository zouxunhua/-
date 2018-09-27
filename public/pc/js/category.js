$(function(){
    //让二级菜单显示出来
    $(".submenu").show();

    //设置当前页和每次请求的大小
    var currentPage = 1;
    var pageSize = 10;

    //获取并渲染数据
    function render() {
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "GET",
            data: {page: currentPage, pageSize: pageSize},
            success: function(data) {
                console.log(data);
                var html = template("category-table", data);
                $("tbody").html(html);
    
                //渲染数据
                //分页插件需要ajax完成之后，获取到数据之后来调用
                $("#pagenator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage: currentPage,//指定当前页
                    totalPages: Math.ceil(data.total / pageSize),//指定总页数
                    size: "small",//设置控件的大小
    
                    //当点击分页组件按钮会调用该方法
                    //index参数，就代表当前点击的是第几页
                    onPageClicked: function (a, b, c, index) {
                        //page指的是点击的页码,修改了当前页
                        currentPage = index;
                        //每一次点击都会去发起ajax请求，获取数据，渲染数据
                        render();
                    }
                });
            }
        });
    }

    //获取数据并刷新页面
    render();


    $("#addcategory-btn").click(function(){
        $("#addcategory-modal").modal("show");
    });

    //手动提交表单， 让下面的表单验证插件生效
    $("button[type=submit]").click(function() {
        $form.submit();
    });

    //表单验证
    var $form = $("form");

    //设置验证规则
    $form.bootstrapValidator({
        //1. 设置验证状态对应的小图标
        feedbackIcons: {
            //如果验证通过，显示的小图标
            valid: 'glyphicon glyphicon-ok',
            //验证不通过
            invalid: 'glyphicon glyphicon-remove',
            //正在验证的状态
            validating: 'glyphicon glyphicon-refresh'
        },

        fields: {
            categoryName: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "分类不能为空"
                    }
                }
            },
        }
    });

    // //表单验证成功之后的事件处理
    $form.on("success.form.bv", function(target) {
        //阻止默认事件（提交表单）
        target.preventDefault();
        // alert("表单验证通过");
        $.ajax({
            url: "/category/addTopCategory",
            type: "post",
            data: $form.serialize(),
            success: function(data) {
                console.log(data);
                if (data.success) {
                    //刷新页面数据
                    render();

                    //把模态框隐藏
                    $("#addcategory-modal").modal("hide");
                }
            }
        });
    });
});