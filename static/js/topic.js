var app = new Vue({
    el: '#article',
    data: {
        id: null,
        author_id: null,
        tab: '',
        content: '',
        title: '',
        last_reply_at: '',
        good: false,
        top: false,
        reply_count: null,
        visit_count: null,
        create_at: '',
        author: {},
        replies: {}
    }
    ,
    methods:{
        getTime: getTime
    },
    updated: function(){
        $('.markdown-text img').click(function(){
            var _self = $(this);
            var src_path = _self.attr("src");
            $("#mymodal img").attr("src", src_path);
            $(".modal").show();
        });
        $(".modal").click(function(){
            $(this).hide();
        });
    }
});


do_ajax("https://cnodejs.org/api/v1/topic/" + "592917b59e32cc84569a7458")
.then(success)
.catch(function(err){
    console.log(err);
});

// ajax 异步请求方法
function do_ajax(url){
    return new Promise(function(solve,reject){
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.send(null);
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    solve(xhr.response);
                }else{
                    reject(xhr.status);
                }
            }
        }
    });
}

function success(data){
    var res = JSON.parse(data);
    // app.$data = res.data;
    app.id = res.data.id;
    app.author_id = res.data.author_id;
    app.tab = res.data.tab;
    app.content = res.data.content;
    app.title = res.data.title;
    app.last_reply_at = res.data.last_reply_at;
    app.good = res.data.good;
    app.top = res.data.top;
    app.reply_count = res.data.reply_count;
    app.visit_count = res.data.visit_count;
    app.create_at = res.data.create_at;
    app.author = res.data.author;
    app.replies = res.data.replies;
    // $("#article").html(res.data.content);
    // console.log(res.data);
};


// 用于处理最后评论时间
function getTime(time){
    var a = new Date();
    var b = new Date(time);
    var o;
    // console.log(a);
    var c = a - b;
    if(c/1000 <= 60){
        o = Math.round(c/1000); 
        return (o+ " 秒前");
    }else if(c/1000/60 <60){
        o = Math.round(c/1000/60);
        return (o + "分钟前");
    }else if(c/1000/60/60 < 24){
        o = Math.round(c/1000/60/60);
        return (o + "小时前");
    }else if(c/1000/60/60/24 < 30){
        o = Math.round(c/1000/60/60/24);
        return (o + "天前");
    }else if(c/1000/60/60/24/30 <12){
        o = Math.round(c/1000/60/60/24/30);
        return (o + "个月前");
    }else{
        o = Math.round(c/1000/60/60/24/30/12);
        return (o + "年前");
    }
};



(function(){
    setInterval(function(){
    $('.markdown-text img').each(function(){
        var _self = $(this);
        var img_path = _self.attr('src');
        if(img_path.startsWith("//")){
            _self.attr("src", "https:" + img_path);
        } 
    })
}, 1000);})();