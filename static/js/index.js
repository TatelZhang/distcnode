"use strict";

var app = new Vue({
    el: "#app",
    data: {
        article_list: null,
        source_api: "https://cnodejs.org/api/v1",
        topics: "https://cnodejs.org/api/v1/topics",
        topic: "https://cnodejs.org/api/v1/topic/",  // topic/:id
        user: "https://cnodejs.org/api/v1/user", //  /user/:loginname
        pages: null,
        curr_page: 1,
        prev_page: true,
        next_page: null,
        tab: "all"
    },
    methods:{
        /**
         * 
         getTop: function(item){
             var topic = this.topic;
             function* get(){
                 var a = yield do_ajax(topic + item.id).then(function(data){it.next(data)});
                 item.something = 250;
                }
                var it = get();
                it.next();
            }
        */
        reply_time: getTime,
        jump: function( index){
            // this.curr_page = index;
            // console.log(typeof index);
            if(typeof(index)==="number"){
                this.curr_page = index;
            }
        }
        
    },
    mounted: function(){
            this.pages = makepage(this.curr_page, this.tab);
    },
    watch: {
        curr_page: function(){
            this.pages = makepage(this.curr_page, this.tab);
            do_ajax(this.topics+`/?tab=${this.tab}&page=${this.curr_page}`)
            .then(success)
            .catch(function(err){
                console.log('Error');
                console.log(err);
            });
            if(this.curr_page===1){
                this.prev_page = true;
            }
            else{
                this.prev_page = false;
            }
        },
        tab: function(){
            this.pages = makepage(this.curr_page, this.tab);
        }
    }
});


// 处理tab点击时间，并阻止默认事件
var a = $("#menuBar li a");
a.click(function(e){
    e.preventDefault();
    a.each(function(){
        $(this).parent().removeClass('white-color');
    });
    $(this).parent().addClass("white-color");
    // console.log(this); // this对象为 DOM a <a href="/?tab=good"></a>;
    var search = this.search; // search = "/?tab=good"
    app.tab =  solve_search(search)['tab'];   // 更新组件中的tab;
    app.curr_page = 1;
    do_ajax(app.topics+search)
    .then(success)
    .catch(function(err){
        console.log('Error');
        console.log(err);
    });
    
    
});

/**
 (function(){
    var pager = $("#pager li a")
    pager.click(function(e){
        e.preventDefault();
        var search = this.search;
        app.curr_page = parseFloat(solve_search(search)['page']);
        do_ajax(app.topics+search)
        .then(success)
        .catch(function(err){
            console.log(err);
        });
    });
})();
 */



do_ajax('https://cnodejs.org/api/v1/topics')
.then(success)
.catch((some)=>{
    console.log(some);
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
    app.article_list = res.data;
    // console.log(res.data);
}


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
}


function makepage(curr_page, tab){
    var page_list = [];
    if(curr_page<=3){
        for(var i=1; i<6; i++){
            if(curr_page===i){
                page_list.push({
                    index: i,
                    page_path: ""
                });
            }else{
                page_list.push({
                index: i,
                page_path: `/?tab=${tab}&page=${i}`
            });
            }
        }
        page_list.push({
            index: "...",
            page_path: ""
        });
    }else if(curr_page>3){
        for(var i=curr_page-3; i<=curr_page+3; i++){
            if(curr_page-3 ===i||curr_page+3===i){
                page_list.push({
                    index: "...",
                    page_path:""
                });
            }else if(curr_page === i){
                page_list.push({
                    index: i,
                    page_path: ""
                });
            }else{
                page_list.push({
                    index: i,
                    page_path: `/?tab=${tab}&page=${i}`
                });
            }
        }
    }
    return page_list;
}


// 用于处理 href 中的search字段 /?k1=v1&k2=v2
function solve_search(str){
    /**
     * @str = /?k1=v1&k2=v2
     */
    var search_k_v = {};
    var get_string = str.split('?')[1];  // k1=v1&k2=v2
    var k_v = get_string.split("&");
    for(var item of k_v){
        item = item.split("=");
        search_k_v[item[0]] = item[1];
    }
    return search_k_v;

}