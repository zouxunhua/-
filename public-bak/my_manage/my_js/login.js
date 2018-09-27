$(function() {
    //1. 拿到form表单， 需要juqery对象
    var $form = $("form");
    //2. 调用bootstrap的validator的方法
    $form.bootstrapValidator({
        //1. 较验成功或失败后的小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //2. 对每个字段配置较验规则
        fields: {
            //1. 字段一
            username: {
                validators: {
                    //1.规则一
                    notEmpty: {
                        message: "用户名不能为空"
                    },
    
                    //2. 规则二
                    stringLength: {
                        min: 4,
                        max: 30,
                        message: '用户名长度必须在6到30之间'
                    }, 
    
                    //3. 规则三
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名由数字字母下划线和.组成'
                    },

                    //4. 失败后消息
                    callback: {
                        message: "用户名错误"
                    }
                }
            }, 

            //2. 字段二
            password: {
                validators: {
                    //1. 规则一
                    notEmpty: {
                        message: "密码不能为空"
                    },

                    //2. 规则二
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '密码长度必须在6到30之间'
                    }, 

                    //3. 规则三 
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码由数字字母下划线和.组成'
                    },

                    //4. callback
                    callback: {
                        message: '密码失败'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        //较验成功之时，默认表单会提交，所以先阻止默认事件，再用ajax提交表单
        e.preventDefault();
        //使用ajax提交逻辑
        /*获取当前的表单*/
        var $form = $(e.target);

        $.ajax({
            url: "/employee/employeeLogin",
            type: "post",
            data: $form.serialize(),
            dataType: "json",
            success: function(data) {
                // $form.data('bootstrapValidator').disableSubmitButtons(false);
                if (data.success) {
                    // window.location.href = "index.html";
                } else {
                    if (data.error === 1000) {
                        $form.data("bootstrapValidator").updateStatus('username', 'INVALID', 'callback');
                    } else if (data.error === 1001) {
                        $form.data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }
            }
        })
    });
})