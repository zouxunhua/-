//获取某个数组的index
Array.prototype.indexOf = function (val) {
    for(var i = 0; i < this.length; i++){
        if(this[i] == val){return i;}
    }
    return -1;
}

//删除某个数组元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if(index > -1){this.splice(index,1);}
}

//去重
Array.prototype.norepeat = function () {
    var arr = this,
        result = [],
        i,
        j,
        len = arr.length;
    for (i = 0; i < len; i++) {
        for (j = i + 1; j < len; j++) {
            if (arr[i] === arr[j]) {
                j = ++i;
            }
        }
        result.push(arr[i]);
    }
    return result;
}


$(function() {
    //获取数据数据
    function getKeywords() {
        //1. 先从localstorage里面把关键字的数组先取出
        var keywordsArr = [];
        //先把保存的关键字的数组字符串取出
        var keywords = window.localStorage.getItem("lt-keywords");

        //如果有存过， 就把这个数组字符串转成数组。
        if (keywords) {
            keywordsArr = JSON.parse(keywords);
        }

        console.log(keywords);

        return keywordsArr;
    }

    function saveKeywords(kewarr) {
        var keysString = JSON.stringify(kewarr);
        window.localStorage.setItem("lt-keywords", keysString);
    }

    //渲染页面
    function render () {
        var data = {keys:getKeywords()}; 
        console.log(data);
        var html = template("searchkeywords", data);
        $(".searchhistory .content").html(html);
    }

    render();

    //一： 保存搜索记录
    //当点击搜索按钮时， 把搜索的关键字保存起来
    //1. 先从localstorage里面把关键字的数组先取出
    $(".searchbutton").click(function(){
        //1. 拿到搜索关键字
        var keyword = $(".searchbar input").val();
        //如果没有写关键字，什么都不做
        if (keyword.length == 0) return;

        //拿到数组
        var keywordsArr = getKeywords();
        //把关键字，塞到对象中
        keywordsArr.push(keyword);
        keywordsArr = keywordsArr.norepeat();
        
        //把对象转成字符串再保存到本地
        saveKeywords(keywordsArr);

        //点完搜索之后，把数据渲染出来
        render();

        //跳到搜索列表页获取数据
        // window.location.href="searchlist.html?keyword="+keyword
        window.sessionStorage.setItem("lt-key", keyword);
        window.location.href = "searchlist.html?proName="+keyword;
    });

    //二.清空搜索记录
    $(".btn_empty").click(function() {
        //1. 把localstorage清掉
        window.localStorage.removeItem("lt-keywords");
        //2. 重新渲染当前的页面
        render();
    });

    //三. 删除某个历史记录
    $(".searchhistory").on("click", ".mui-icon-closeempty", function(){
        //alert("删除该关键字");
        var keywordsArr = getKeywords();
        //删除对应的这个值
        //拿到要删除的值的key
        var key = $(this).siblings(".keyword").html();
        keywordsArr.remove(key);

        //要把新的数组，重新往localstorage里面保存一份
        saveKeywords(keywordsArr);
        //重新渲染数据      
        render();
    });
});

/*
1. 拿到数组
2. 操作数组（删除或增加或清空）
3. 保存
4. 渲染
*/

