$(function(){
  //发送ajax请求，获取一级分类的数据
  $.ajax({
    type:"get",
    url:"/category/queryTopCategory",
    success:function (data) {
      // console.log(data);
      var html = template("category", data);
      console.log(html);
      $(".lt-category").html( html );

      //渲染完一级分类后，渲染二级分类（默认渲染data.rows[0]）
      renderSecond(data.rows[0].id);
    }
  });


  //渲染哪个一级分类下的二级分类
  function renderSecond(id){
    $.ajax({
      type:"get",
      url:'/category/querySecondCategory',
      data:{
        id:id
      },
      success:function (data) {
        console.log(data);
        var html = template("brand", data);
        $(".lt-brand").html( html );

      }
    });
  }

  $(".lt-category").on("click", "a", function(){
    var id = $(this).data("id");
    // console.log(id);
    // alert(id);
    renderSecond(id);
  });
});