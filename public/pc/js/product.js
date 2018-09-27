$(function(){
    //分页显示的全局变量
    var currentPage = 1;
    var pageSize = 5;

    //1. 获取并渲染数据
    function render() {
        $.ajax({
            url: "/product/queryProductDetailList",
            type: "GET",
            data: {page: currentPage, pageSize: pageSize},
            success: function(data) {
                console.log(data);
                var html = template("product-table", data);
                $("tbody").html(html);

                //实现分页功能
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

    //第一次获取数据
    render();

    //表单
    var $form = $("form");

    //点击添加商品按钮，弹出模态框
    $("#addproduct-btn").click(function() {
        $("#addproduct-modal").modal("show");

        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "GET",
            data: {page: 1, pageSize: 100},
            success: function(data) {
                console.log(data);
                var html = template("subcategory-dropdown", data);
                console.log(html);
                $(".dropdown-menu").html(html);
            }
        })

    });


    //处理下拉框的点击事件
    $(".dropdown-menu").on("click", "a", function() {
        // alert("哈哈");
        $("#dropdownMenu1 .val").html($(this).html());
        $("input[name=brandId]").val($(this).data("id"));
        $form.data('bootstrapValidator').updateStatus("brandId", "VALID");
    })

    
    //上传图片
    //上传图片
    $("#fileupload").fileupload({
        dataType:"json",
        //文件上传完成时，会执行的回调函数，通过这个函数就能获取到图片的地址
        //第二个参数就有上传的结果 data和服务器返回的数据并不完全一样
        done:function (e, data) {
            // console.log("================="+data);
            // console.log("================="+data.result.picAddr);
            // console.log("================="+data.result.picName);

            //data.result.picAddr就存储了图片的地址
            var img = '<img data-name="'+data.result.picName+'" data-addr="'+data.result.picAddr+'" class="img-thumbnail" src="'+data.result.picAddr+'" alt="">';
            $(".imgbox").append(img);


            // $(".imgbox").on("dblclick", "img", function() {
            //     alert("aaaa");
            // });

            //双击某一张图片，就把它删除，删除之后，再做一次表单验证
            $(".imgbox").off("dblclick", "img").on("dblclick", "img", function () { 
                //alert("aaaa");
                $(this).remove();

                //删除之后，重新去做表单验证
                if($(".imgbox img").length == 3) {
                    $form.data('bootstrapValidator').updateStatus("productImg", "VALID");
                } else {
                    $form.data('bootstrapValidator').updateStatus("productImg", "INVALID", "notEmpty");
                }
            });

            if($(".imgbox img").length == 3) {
                $form.data('bootstrapValidator').updateStatus("productImg", "VALID");
            } else {
                $form.data('bootstrapValidator').updateStatus("productImg", "INVALID", "notEmpty");
            }
        }
    });




    //表单验证
    $("button[type=submit]").click(function() {
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
            brandId: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },

            proName: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },

            proDesc: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },

            num: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请输入商品库存"
                    }
                }
            },

            
            size: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请输入商品尺码"
                    }
                }
            },

            oldPrice: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },

            price: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请输入商品现价"
                    }
                }
            },

            productImg: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请选择三张图片"
                    }
                }
            },
        }
    });

    $form.on("success.form.bv", function(target) {
        //阻止默认事件（提交表单）
        target.preventDefault();
        //alert("哈哈表单验证通过");


        //生成表单提交数据
        var data = $form.serialize();
        data = data.replace('&productImg=', '');
        console.log(data);
        console.log("=========================================");
        console.log($("img").eq(0).data("name"));


        //把图片的数据拼上去
        data = data+"&picName1="+$(".imgbox img").eq(0).data("name")+"&picAddr1="+$(".imgbox  img").eq(0).data("addr");
        data = data+"&picName2="+$(".imgbox img").eq(1).data("name")+"&picAddr2="+$(".imgbox img").eq(1).data("addr");
        data = data+"&picName3="+$(".imgbox img").eq(2).data("name")+"&picAddr3="+$(".imgbox img").eq(2).data("addr");

        console.log(data);

        // //提交表单， 添加商品
        $.ajax({
            url: "/product/addProduct",
            type: "POST",
            data: data,
            success: function(data) {
                //console.log(data);
                $("#addproduct-modal").modal("hide");
                render();
            }
        })
    });
});