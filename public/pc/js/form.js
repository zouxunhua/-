$(function() {
    //拿到表单
    $form = $("form");

    //表单验证
    //设置验证规则
    $form.bootstrapValidator({
        //excluded,指定哪些表单里面哪些元素不验证，如果设为空， 就说明，所有的表单元素都要验证
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
            email: {
                validators: {
                    //1. 规则,验证是否输入了字符
                    notEmpty: {
                        message: "请选择二级分类"
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

                    //是在其它地方（手动修改表单的验证状态）使用这个错误指示时，才会使用到
                    callback: {
                        message: "密码错误"
                    }
                }
            },
        }
    });

    //当表单验证成功之后，做某事
    $form.on("success.form.bv", function(target) {
        //默认情况下，是直接提交表单的，如果我们不想提交表单，就需要阻止默认事件
        target.preventDefault();
        //在下面可以去发一起ajax请求
        
    });

    //手动更新字段的状态为成功
    $(".btn-success").click(function() {
        //拿到表单的验证的bootstrapValidator的对象（可以做表单验证的类创建出来的对象）。
        var validatator = $form.data('bootstrapValidator');
        //调用对象的方法，去修改表单验证的状态
        validatator.updateStatus("email", "VALID");
    });

    //手动更新字段的状态为成功
    $(".btn-danger").click(function() {
        //拿到表单的验证的bootstrapValidator的对象（可以做表单验证的类创建出来的对象）。
        var validatator = $form.data('bootstrapValidator');
        //调用对象的方法，去修改表单验证的状态
        validatator.updateStatus("email", "INVALID", "callback");
    });
});

//总结:
/*
1. 表单提交时，会触发表单验证的方法
    $form.bootstrapValidator()
2. 在bootstrapValidator方法里，我们可以去设置验证规则（参考上面的代码）

3. 当表单验证成功之后，会调用 $form.on("success.form.bv", function(target) 的方法
    在这个方法里面，默认会直接提交表单，如果我们不想直接提交，可以阻止默认事件

4. 有时候，我们希望，手动去更新表单的验证状态，这个时候，就需要拿到bootstrapValidator对象，再去调用其 updateStatus 方法。
        //拿到表单的验证的bootstrapValidator的对象（可以做表单验证的类创建出来的对象）。
        var validatator = $form.data('bootstrapValidator');
        //调用对象的方法，去修改表单验证的状态
        validatator.updateStatus("email", "INVALID", "callback");



*/