mui('.mui-input-row input').input(); 

$(function() {
    $("button.login").click(function() {
        var check = true;
        mui(".mui-input-group input").each(function () {
            //若当前input为空，则alert提醒 
            if (!this.value || this.value.trim() == "") {
                var label = this.previousElementSibling;
                mui.alert(label.innerText + "不允许为空");
                check = false;
                return false;
            }
        }); //校验通过，继续执行业务逻辑 
        if (check) {
            // mui.alert('验证通过!')
            //发起ajax请求
            $.ajax({
                url: "/employee/employeeLogin",
                type: "post",
                data: $("form").serialize(),
                dataType: "json",
                success: function(data) {
                    if (data.success) {
                        // window.location.href = "index.html";
                    } else {
                        mui.alert(data.message);
                    }
                }
            });
        }
    });


    $("button.reset").click(function() {
        alert("aaa");
        $("form")[0].reset();
    });
});
