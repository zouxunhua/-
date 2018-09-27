$(function(){
    //让二级菜单显示出来
    $(".submenu").show();

    //设置当前页和每次请求的大小
    var currentPage = 1;
    var pageSize = 5;

    //获取并渲染数据
    function render() {
        $.ajax({
            url: "/category/querySecondCategoryPaging",
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


    //显示模态框
    $("#addcategory-btn").click(function(){
        $("#addsubcategory-modal").modal("show");
    });

    //获取一级分类的信息，并且渲染数据
    $.ajax({
        url: "/category/queryTopCategoryPaging",
        type: "GET",
        data: {page: 1, pageSize: 100},
        success: function(data) {
            var html = template("category-dropdown", data);
            $("#categor-dropdown").html(html);
        }
    });

    //下拉框的点击事件（选择一级分类）
    console.log($("#categor-dropdown"));
    $("#categor-dropdown").on("click", "li a", function () { 
        console.log("哈哈");
        //把被点击的a标签的值赋值给下拉框的按钮
        $("#addsubcategory-modal #dropdownMenu1").html($(this).html());
        //把a标签里面 data-id的值，赋值给 categoryId 
        $("input[name=categoryId]").val($(this).data("id"));

        //把表单元素的状态设为合法状态（验证通过）
        var validator = $("form").data('bootstrapValidator'); 
        validator.updateStatus("categoryId", "VALID");
    });

    //上传图片
    $("#fileupload").fileupload({
        dataType:"json",
        //文件上传完成时，会执行的回调函数，通过这个函数就能获取到图片的地址
        //第二个参数就有上传的结果 data和服务器返回的数据并不完全一样
        done:function (e, data) {
            console.log("================="+data);
            console.log("-------------------"+data.result.picAddr);
            $(".form-group img").attr("src", data.result.picAddr);
            $("input[name=brandLogo]").val(data.result.picAddr);

            //把表单元素的状态设为合法状态（验证通过）
            var validator = $("form").data('bootstrapValidator'); 
            validator.updateStatus("brandLogo", "VALID");
        }
    });

    //表单元素
    var $form = $("form");

    $("#addsubcategory-modal button[type=submit]").click(function() {
        $form.submit();
    });

    //表单验证
    $form.bootstrapValidator({
        //excluded,指定哪些表单元素是不验证， 默认情况下，所有隐藏元素，disabled的元素，它都是会忽略不验证，如果说，我们希望所有元素都验证，那就把下面的数组设为空
        excluded: [],

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
            categoryId: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请选择图片"
                    }
                }
            }
        }
    });

    //表单验证成功之后的事件处理
    $form.on("success.form.bv", function(target) {
        //阻止默认事件（提交表单）
        target.preventDefault();
        // alert("哈哈， 表单验证已成功");

        //提交表单
        $.ajax({
            url: "/category/addSecondCategory",
            type: "POST",
            data: $form.serialize(),
            success: function(data) {
                console.log(data);
                if (data.success) {
                    //说明提交二级分类已经成功了
                    $("#addsubcategory-modal").modal("hide");
                    render();
                }
            }
        });
    });
});

