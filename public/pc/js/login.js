$(function() {
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
            username: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "用户名不能为空"
                    },

                    //2. 规则2
                    stringLength: {
                        min: 4,
                        max: 30,
                        message: '用户名长度必须在6到30之间'
                    },

                    //3. 规则3
                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名由数字字母下划线和.组成'
                    },

                    callback: {
                        message: "用户名错误"
                    }
                }
            },

            password: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "密码不能为空"
                    },

                    //2. 规则2
                    stringLength: {
                        min: 4,
                        max: 30,
                        message: '密码长度必须在6到30之间'
                    },

                    //3. 规则3
                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码由数字字母下划线和.组成'
                    },
                    callback: {
                        message: "密码错误"
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
        // console.log($form.serialize());

        //自己发起ajax开始登录
        $.ajax({
            url: "/employee/employeeLogin",
            type: "POST",
            data: $form.serialize(),
            success: function(data) {
                console.log(data);
                //{success: true} 说明登录成功了
                if (data.success) {
                    console.log(window.history);
                    //返回上一个页面
                    // window.history.go(-1);
                    //先从sessionstorage取出存的前一个页面的地址，如果有值， 往回跳, 跳之前，把sessionStorage清空掉。如果没有值，就直接跳到主页
                    var href = window.sessionStorage.getItem("href");

                    if (href) {
                        window.location.href = window.sessionStorage.getItem("href");
                        window.sessionStorage.removeItem("href");
                    } else {
                        window.location.href = "index.html";
                    }
                }

                //用户名不存在
                if (data.error == 1000) {
                    //拿到表单验证插件的对象
                    var validator = $form.data("bootstrapValidator");
                    //更新input的状态
                    validator.updateStatus("username", "INVALID", "callback");
                }

                //密码错误
                if (data.error == 1001){
                    //拿到表单验证插件的对象
                    var validator = $form.data("bootstrapValidator");

                    //更新input的状态
                    validator.updateStatus("password", "INVALID", "callback");
                }
            }
        });
    });
});