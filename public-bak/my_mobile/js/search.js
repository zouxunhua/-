$(function(){
    addsearchlist("shoes");

    //渲染搜索历史
    renderSearchlist();

    //获取搜索记录， 渲染搜索记录列表
    function getsearchlist() {
        var list = window.localStorage.getItem("lt-search");
        var listarr = !list ? [] : JSON.parse(list)
        return listarr;
    }

    getsearchlist();

    //删除记录
    function deletesearchlist(index) {
        var listarr = getsearchlist();
        listarr.splice(index, 1);
        var liststr = JSON.stringify(listarr);
        localStorage.setItem("lt-search", liststr);
    }

    //清空搜索记录
    function clearsearchlist() {
        localStorage.removeItem("lt-search");
    }

    //添加搜索记录
    function addsearchlist (key) {
        var listarr = getsearchlist();
        listarr.push(key);
        var liststr = JSON.stringify(listarr);
        localStorage.setItem("lt-search", liststr);
    }

    function renderSearchlist() {
        var list = getsearchlist();
        console.log(list);
        var html = template("searchlist", {rows: list});
        // console.log(html);
        $(".list").html(html);
    }

    //点击删除按钮
    $(".searchhistory .list").on("click", ".delete", function() {
        $index = $(".searchhistory .list .delete").index(this);
        deletesearchlist($index);
        renderSearchlist();
    });


    //点击清空按钮
    $(".btn_empty").on("click", function(){
        // alert("ak");
        clearsearchlist();
        renderSearchlist();
    });


    //点击搜索按钮
    $(".search-button").click(function() {
        //1. 保存搜索记录
        $key = $("#searchinput").val();
        // console.log($key);
        addsearchlist($key);

        //先保存到sessionStorage中
        window.sessionStorage.setItem("search-key", $key);
    });
});