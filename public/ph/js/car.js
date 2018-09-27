$(function() {

  //删除某条数据
  function deleteFromCart(id) {
    $.ajax({
      url: "/cart/deleteCart",
      type: "GET",
      data: {id: id},
      success: function(data) {
        checkLogin(data);
        //console.log(data);
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
      }
    })
  }

  function updateCar(prams) {
    $.ajax({
      url: "/cart/updateCart",
      type: "POST",
      data: prams,
      success: function(response) {
        checkLogin(response);
        //console.log(response);
        //一旦修改成功了， 就重新更新数据, 手动调用下拉刷新的方法
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
      }
    });
  }

  //在mui初始化时，实现某个元素的下拉刷新效果
  mui.init({
    //下拉刷机关报
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down : {
        style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
        auto: true,//可选,默认false.首次加载自动上拉刷新一次
        //下拉刷新要干的事情
        callback : function() {
          //发起网络请求获取数据，获取完数据之后，把下拉刷新停掉
          setTimeout(function() {
            console.log("开始下拉刷新操作");
            //发起ajax请求获取数据，并且渲染数据

            $.ajax({
              url: "/cart/queryCartPaging",
              type: "GET",
              data: {page: 1, pageSize: 10},
              success: function(data) {
                console.log(data);

                //检查是否登录，如果没有登录，就跳转到登录页
                checkLogin(data);

                //渲染数据
                var html = template("carcontent", data);
                $(".mui-table-view").html(html);

                //点击删除操作
                //MUI对点击事件又重做了处理（因为300毫秒延迟的问题）
                mui(".mui-table-view").on("tap", ".mui-table-view-cell .mui-btn-red", function() {
                  //alert("a");
                  var id = $(this).parent().data("id");
                  console.log(id);
                  //发起ajax请求删除数据
                  deleteFromCart(id);

                  //直接把当前行删除
                  $(this).parent().parent().remove();
                });

                //编辑操作
                mui(".mui-table-view").off("tap", ".mui-table-view-cell .mui-btn-blue").on("tap", ".mui-table-view-cell .mui-btn-blue", function() {
                  //alert("a");
                  //编辑功能， 需要使和数据来渲染模板。当前是每几个元素，就使用数组里面的第几个数据
                  var index = $(this).parent().data("index");
                  // alert("操作的是第"+index+"元素");

                  //使用对应的index的data来渲染数据
                  var html = template("detail", data.data[index]);
                  //字符串替换, html是一个字符串，它有很多\n（就是换行符），mui在使用这个字符串里，会把换行符把它替换成 br
                  html = html.replace(/\n/g, "");

                  //默认的尺码
                  var size = data.data[index].size;

                  //e是代表点击的第几个按钮
                  mui.confirm(html, "修改商品", ["取消", "确认"], function(e) {
                    if (e.index == 1) {
                      //alert("确认");
                      var num = mui(".mui-numbox").numbox().getValue();
                      //console.log(({num: num, size: size}));
                      var parmas =  {num: num, size: size, id: data.data[index].id};
                      //发起ajax请求， 来修改数据
                      updateCar(parmas);
                    } 
                  });

                  //让数字输入框组件生效
                  // mui(".mui-numbox").numbox();
                  mui(".mui-numbox").numbox().setValue(data.data[index].num);

                  //点击尺码高亮，并且选中该尺码
                  //注册事件
                  $(".size").on("click", "span", function() {
                    //alert("aaa");
                    //让该尺码高亮
                    $(this).addClass("active").siblings().removeClass("active");

                    //拿到尺码
                    size = $(this).html();
                  });
                });

              }
            });

            mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
          }, 1000);
        }
      }
    }
  });


                  //方案二： 当我们执行 change事件的时候，我们永远把所有的选中状态的checkbox取到，循环它。直接算出总数
                  $("input[type=checkbox]").change(function() {
                    var total = 0;
                    //拿到所有被选中的checkbox
                    console.log($("input[type=checkbox]:checked")); 
                    $("input[type=checkbox]:checked").each(function(index, target) {
                      var price = $(target).data("price");
                      var num = $(target).data("num");
                      var money = Number(price) * Number(num);
                      //算出总金额
                      total += money;
                    });
  
                    //把数据显示下面
                    $(".total .money").html(total.toFixed(2));
                  });
  

  

})