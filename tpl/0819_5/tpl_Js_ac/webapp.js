//设置公告
if(notetitle){
    $('.notetitle').html(notetitle);
    $('.notecontent').html(notecontent);
}

//存放删除和需要添加的播放界面代码 因为异步 需要全局变量
var vodShowHtml_remove_add;

jQuery('#shap_qrcode').qrcode({
    render: "canvas", //也可以替换为table
    foreground: "#000",
    text: "http://app.kkdy.website/?reg=1&uid=9900" + $(".local_user_id").val()
  });

//定义路由数组 用于控制前进后退
var arr_History = new Array();
var isneed_addpageid = 1;
var this_page_historyID = 0;
//监听路由
$(document).on("pageInit", function (e, pageId, $page) {
    if (isneed_addpageid == 1) {
        //当前页面不是后退或者前进过来的
        this_page_name = pageId;
        if (arr_History[this_page_historyID + 1] != this_page_name) {
            if (this_page_historyID+1 < arr_History.length){
                arr_History=arr_History.slice(0,this_page_historyID+1);//销毁后面的
                this_page_historyID = arr_History.length;
                arr_History.push(pageId); //添加页面
            }else{
                this_page_historyID = arr_History.length;
                arr_History.push(pageId); //添加页面
            }

            //console.log("pageInit" + this_page_historyID + " pageId " + pageId);
        }else{
            this_page_historyID=this_page_historyID+1;
        }
    }
    isneed_addpageid = 1;//防止新窗口无法记录
    //处理前进后退按钮样式
   // console.log(this_page_historyID);
    if (this_page_historyID < 1) {
        //无法后退
        $(".Goback").addClass("go_disable");
    } 
    else{
        
        $(".Goback").removeClass("go_disable");

    }
    if (this_page_historyID >= arr_History.length - 1) {
        //无法前进
        $(".Goforward").addClass("go_disable");
    } 
    else{
        $(".Goforward").removeClass("go_disable");

    }
    //初始化 观看记录
    if(pageId == "page_played") {
        localStorage_update_played();
    }
    //初始化 收藏夹
    if(pageId == "page_fav") {
        localStorage_update_fav();//先显示 后更新
        u_fav_list();
    }

});
// 后退按钮   --
function Goback() {
    isneed_addpageid = 0;
    if (this_page_historyID < 1) {
        $.toast("没法后退了哦");
    } else {
        //$.router.back();
        this_page_historyID = this_page_historyID - 1;
        console.log("goback pageInit" + this_page_historyID + " pageId " + arr_History[this_page_historyID]);
        $.router.load("#" + arr_History[this_page_historyID]);

    }
}
//前进按钮
function Goforward() {
    isneed_addpageid = 0;
    if (this_page_historyID >= arr_History.length - 1) {
        $.toast("没法前进了哦");
    } else {
        //$.router.back();
        this_page_historyID = this_page_historyID + 1;
        console.log("Goforward pageInit" + this_page_historyID + " pageId " + arr_History[this_page_historyID]);

        $.router.load("#" + arr_History[this_page_historyID]);

    }
}
//重写打开page 以便关闭侧栏 gotopage
function gotopage(Str_goto) {
    $.closePanel(); //关闭侧栏
    $.router.load(Str_goto, false, 'left');
}
//重写打开page  end
//黑夜模式


//黑夜模式的提示语
$(document).on('click', '.FAQ-dark', function () {
    $.alert('<div style="text-align: left;">自动跟随系统的显示模式自动切换暗黑模式，也可以手动切换</div>', '切换说明');
});
//判断系统是否是暗黑模式
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    $.cookie('themebody', '1', { expires: 180, path: '/' });
    CheckDark();
} else {
    $("body").removeClass("theme-dark");
    $("#theme-dark").prop("checked", false)
   $.cookie('themebody', '0', { expires: 180, path: '/' });
}
// 监听暗黑模式切换
let media = window.matchMedia('(prefers-color-scheme: dark)');
let callback = (e) => {
    let prefersDarkMode = e.matches;
    if (prefersDarkMode) {
        $.cookie('themebody', '1', { expires: 180, path: '/' });
        CheckDark();
    } else {
        $("body").removeClass("theme-dark");
        $("#theme-dark").prop("checked", false)
       $.cookie('themebody', '0', { expires: 180, path: '/' });
    }
};
if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', callback);
} else if (typeof media.addListener === 'function') {
    media.addListener(callback);
}
//读取cookie并修改
function CheckDark(){
    if (($.cookie('themebody') == 1)) {
        $("body").addClass("theme-dark");
        $("#theme-dark").prop("checked", true)
    } else {
        $("body").removeClass("theme-dark");
        $("#theme-dark").prop("checked", false)
    }
}
//颜色按钮点击
$("input[name='theme-dark']").on("change", function () {
    var change = $("#theme-dark").is(':checked'); //checkbox选中判断
    if (change) {
        $.cookie('themebody', '1', { expires: 180, path: '/' });
        CheckDark();
        $.toast("已切换到黑夜模式");
    } else {
        $.cookie('themebody', '0', { expires: 180, path: '/' });
        CheckDark();
        $.toast("已取消黑夜模式");
        return false;
    }
})
// 黑夜模式   --end


// 确定退出   --start
$(document).on('click', '.loginout', function () {
    var buttons1 = [
        {
            text: '确定退出登录吗???',
            label: true
        },
        {
            text: '退出本机',
            onClick: function () {
                localStorage.removeItem(localStor_name_u_info); //删除localStorage
                $(".local_user_id").val(0);
                $(".local_user_pwd").val(0);
                $(".local_page_random").val(0);
                $.closePanel(); //关闭侧栏
                $.router.load("#page-login");
                $.toast("已退出，请重新登录");

            }
        },
        {
            text: '退出所有设备',
            onClick: function () {
                $.confirm('退出所有已经登录的设备', '退出登录', function () {
                    $.ajax({
                        url: api_vhost[WL]+"?ac=u_loginoutall",
                        type: "post",
                        dataType: "json",
                        data: $('#userinfo_local').serialize(),//传送用户信息过去,
                        beforeSend: function () {
                            $.toast('正在提交...')
                        },
                        success: function (r) {
                            if (r.code == 1) {
                                localStorage.removeItem(localStor_name_u_info); //删除localStorage
                                $(".local_user_id").val(0);
                                $(".local_user_pwd").val(0);
                                $(".local_page_random").val(0);
                                $.closePanel(); //关闭侧栏
                                $.router.load("#page-login");
                                $.toast(r.msg);
                            }
                            else {
                                $.toast("提示：" + r.code + " " + r.msg);
                            }
                        },
                        error: function () {
                            $.toast("网络出了一点问题");
                        },
                        complete: function () {
                        }
                    });
                });
               

            }
        },
    ]  ;
    
    var buttons2 = [
        {
            text: '取消',
            bg: 'danger'
        }
    ]  ;
    var groups = [buttons1, buttons2]  ;
    $.actions(groups);
});
// 确定退出   --end

//延时隐藏 功能导航文字 start
$(function () { setTimeout(function () { $(".hidden5s").hide(); }, 3000); })
//延时隐藏 功能导航文字 end

//搜索 start
// 自动填入关键词
$(document).on('click', '.keywords span', function () {
    $("#searchinput").val($(this).html());
});
//开始搜索，并处理一些字符串锅炉
function search() {
    var keywd = $("#searchinput").val();
    var pattern = new RegExp("['#$%^&*()<>=]");
    if (keywd != "" && keywd != null) {
        if (pattern.test(keywd)) {
            $.alert('搜索关键词中有非法字符，请重新输入');
            $("#searchinput").attr("value", "");
            $("#searchinput").focus();
            return false;
        } else {
            $.showPreloader('搜索 ' + keywd + ' ...');
            searchJsong(keywd);
            setTimeout(function () {
                $.hidePreloader();
            }, 10000);
        }
    }
    else {
        $.toast("请输入关键词");
        $("#searchinput").focus();
        return false;
    }
}
//搜索 获取json数据并循环
function searchJsong(keywd) {
    localStorage_searchwd(keywd);//保存搜索记录
    //获取数据
    $.ajax({
        url: api_vhost[WL]+"?ac=u_search&wd="+keywd,
        type: "post",
        dataType: "json",
        data: $('#userinfo_local').serialize(), //传送用户信息过去,
        beforeSend: function () {
            
        },
        success: function (r) {
            if (r.code == 1) {
                $.hidePreloader(); //隐藏搜索框
                var json_rows_temp = r.list; //视频数据
                var json_limitlength = json_rows_temp.length; //获取到的条数
                if (json_limitlength > 0) {
                    $("#page-search #listpic").show();//显示搜索结果面板
                    if (json_limitlength<20){
                        $('#page-search #listpicTitle').html("搜索 “" + keywd + "” 共搜索到" + json_limitlength + "数据"); //显示搜索条数
                    }else{
                        $('#page-search #listpicTitle').html("搜索 “" + keywd + " 搜到到很多数据，这里为您显示前20条。如果没有你想要的视频，请调整关键词重新搜索"); //显示搜索条数
                    }
                    $('#page-search #search_ShoWLi').html(""); //清空搜索内容
                    //把json存入
                    localStorage.removeItem("searchList");
                    localStorage.setItem("searchList", JSON.stringify(json_rows_temp));
                    //console.log( localStorage.getItem("searchList"));
                    //循环数据 
                    for (var json_i = 0; json_i < json_limitlength; json_i++) {
                        Json_To_piclist_html(json_rows_temp[json_i], json_i, "#search_ShoWLi", "search"); //处理格式化本条数据
                    }
                    Check_and_modify();
                }
                else {
                    $("#listpic").hide();
                    $.hidePreloader();
                    $.toast("没有搜索到影片，请留言返回或检查网络设置");
                }
            }
            else {
                $.hidePreloader();
                $.toast("提示：" + r.code + " " + r.msg);
            }
        },
        error: function () {
            $.hidePreloader(); //隐藏搜索
            $.toast("无法搜索服务器错误");
        },
        complete: function () {
        }
    });
    
    
    
    setTimeout(function () {
        $.hidePreloader(); //15秒后强制关闭
    }, 15000);

    

}
//搜索 处理格式化本条数据
function Json_To_piclist_html(Json_row, json_i, append_To, fromLoalStorage) {
    //处理标签内容 读取模板的内容并修改 然后添加到显示里面listpic_html_li
    $('#listpic_html_li .item-media').html('<img src="' + Json_row.vod_pic + '">'); //图片
    $('#listpic_html_li .item-title').html(Json_row.vod_name); //标题
    $('#listpic_html_li .item-after').html(Json_row.vod_year); //年代
    $('#listpic_html_li .daoyan').html(Json_row.vod_area + " " + Json_row.vod_lang + " " + Json_row.vod_director); // 国家 语言 导演
    $('#listpic_html_li .yanyuan').html(Json_row.vod_actor); //演员
    $('#listpic_html_li .jieshao').html(Json_row.vod_blurb); //介绍
   // $("#listpic_html_li a").attr("href", "javascript:open_vod_fromJson(" + json_i + ",'" + fromLoalStorage + "');"); //打开链接传递数组参数过去
    $("#listpic_html_li .link").attr("onclick", "open_vod_fromJson(" + json_i + ",'" + fromLoalStorage + "');"); //打开链接传递数组参数过去
    //上次观看到
    
    //添加收藏
    $("#listpic_html_li #thisvod").attr("class","vodid_"+Json_row.vod_id);
    $("#listpic_html_li .addfav").attr("onclick","u_fav_add("+Json_row.vod_id+");");
    $("#listpic_html_li .delfav").attr("onclick","u_fav_del("+Json_row.vod_id+");");
    //追加到最后
    $(append_To).append($("#listpic_html_li").html());
}
// 搜索  创建一个popup 并打开 然后把数据存入
function open_vod_fromJson(json_i, fromLoalStorage) {
    var fromLoalStorage;
    if (fromLoalStorage == "search") {
        //从搜索结果里读取
        var JSON_vods = JSON.parse(localStorage.getItem("searchList"));
    }
    if (fromLoalStorage == localStor_name_u_played) {
        //从历史记录里面读取
        var JSON_vods = JSON.parse(localStorage.getItem(localStor_name_u_played));
    }
    if (fromLoalStorage == localStor_name_u_fav) {
        //从收藏夹读取
        var JSON_vods = JSON.parse(localStorage.getItem(localStor_name_u_fav));
    }
    //先恢复模板 
    if (vodShowHtml_remove_add) {
        $("#Show_vodFromJson_to_html").empty(); //如果模板使用过清空模板
        $("#Show_vodFromJson_to_html").append(vodShowHtml_remove_add); //恢复
    }
    vod_json_html(fromLoalStorage,JSON_vods,json_i); //格式化一组json数据的第i条 写到单独函数里面 方便复用
    //移除 模板的class  
    $("#Show_vodFromJson_to_html #play_vod").removeClass("Show_Vod_to_guest_class");
    //销毁 模板 为了避免冲突 并保存到全局变量
    vodShowHtml_remove_add = $("#Show_vodFromJson_to_html #play_vod").detach();
    //打开这个层
    $.popup('.Show_Vod_to_guest_class');

    if (JSON_vods[json_i].vod_down_url != "" == "") {
        //删除下载相关的内容
        $("#Show_Vod_to_guest #downloadbutton").detach(); //下载按钮
        $("#Show_Vod_to_guest .downloadtab").detach(); //下载标签
    }
    //在播放窗口更新
    localStorage_played("", "", JSON_vods[json_i]);  //更新播放记录
    //从播放记录里面获取的本集信息
    if (fromLoalStorage == localStor_name_u_played) {
        get_news_vod_info(JSON_vods[json_i].vod_id);//更新本视频
    }

}
//格式化一条视频信息到弹窗
// 写到单独函数里面 方便复用
function vod_json_html(fromLoalStorage,JSON_vods,json_i){
 //修改 Show_vodFromJson_to_html play_vod 的内容
    //修改css属性 方便后面打开
    $("#Show_vodFromJson_to_html #play_vod").addClass("Show_Vod_to_guest_class");
    $('#Show_vodFromJson_to_html h1').html("正在播放 " + JSON_vods[json_i].vod_name); //标题
    $('.vod_name').html(JSON_vods[json_i].vod_name); //所有 vod_name
    $('#Show_vodFromJson_to_html .pianming').html(JSON_vods[json_i].vod_name); //片名
    $('#Show_vodFromJson_to_html .bieming').html(JSON_vods[json_i].vod_sub); //片名
    $('#Show_vodFromJson_to_html .daoyan').html(JSON_vods[json_i].vod_director);
    $('#Show_vodFromJson_to_html .zhuyan').html(JSON_vods[json_i].vod_actor);
    $('#Show_vodFromJson_to_html .shangying').html(JSON_vods[json_i].vod_year + " " + JSON_vods[json_i].vod_area + " " + JSON_vods[json_i].vod_lang);
    $('#Show_vodFromJson_to_html .vodcontent').html(JSON_vods[json_i].vod_content); //介绍

    //工具栏的处理
    //无法播放
    $('#Show_vodFromJson_to_html .wufabofang').attr('onclick','gbook_save("无法播放视频id：'+JSON_vods[json_i].vod_id+' 片名:'+JSON_vods[json_i].vod_name+'")');
    //收藏本片
    $("#Show_vodFromJson_to_html .addthisfav").attr("onclick","u_fav_add("+JSON_vods[json_i].vod_id+");");

    //下载地址 需要简单处理一下 用# 拆分每条 用 $ 拆分标题和url
    if (JSON_vods[json_i].vod_down_url != "") {
        var arr_AllDownUrl = JSON_vods[json_i].vod_down_url.split("#")
        var temp_DownURl = "";
        $.each(arr_AllDownUrl, function () {
            temp_DownURl = temp_DownURl + this.split("$")[1] + "<br />";
        });
        $('#Show_vodFromJson_to_html .AllDownUrl').html(temp_DownURl);
    }
    //播放地址的处理
    var Play_From = "";
    var Play_urls = "";
    //分拆播放源
    if (JSON_vods[json_i].vod_play_from==""){
        $('#Show_vodFromJson_to_html .PlayAllButtons .buttons-tab').html("本视频暂只能下载后观看");

    }else{
        var reg_from = new RegExp('\\$\\$\\$' , "g" );//在收藏夹数据里面 播放来源用$$$分割的
        var Arr_Play_From = JSON_vods[json_i].vod_play_from.replace(reg_from, ',' ).split(",");
        //循环播放器
        var is_frist = 0;
        var frist_frome;
        $.each(players_url, function (players_url_i, thispaly) {  //循环播放器 以便调整顺序
            $.each(Arr_Play_From, function (i) {
                if ($.trim(thispaly[0]) == $.trim(this)) {
                    is_frist = is_frist + 1;
                    if (is_frist == 1) {
                        frist_frome = i; //记录第一个播放器来源
                        Play_From = '<a href="#PlayUrl_' + this + '" class="tab-link active button ">' + thispaly[1] + '</a>';
                    }
                    else {
                        Play_From = Play_From + '<a href="#PlayUrl_' + this + '" class="tab-link  button">' + thispaly[1] + '</a>';
                    }
                }
            });
        });
        $('#Show_vodFromJson_to_html .PlayAllButtons .buttons-tab').html(Play_From);
    }   
    var temp_this;
    //分拆Url 为N组
    var Arr_vod_play_url = JSON_vods[json_i].vod_play_url.split('$$$');
    var temp_this_url = "";
    $('#Show_vodFromJson_to_html .PlayAllButtons .tabs').empty();
    $.each(Arr_vod_play_url, function (i) {
        if (i == frist_frome) {
            Play_urls = '<div id="PlayUrl_' + Arr_Play_From[i] + '" class="fenji tab active">';
        }
        else {
            Play_urls = '<div id="PlayUrl_' + Arr_Play_From[i] + '"  class="fenji tab">';
        }
        //Play_urls=Play_urls+i;
        //循环每一组播放地址
        $.each(this.split("#"), function (ii) {
            temp_this = this.split("$");
            temp_this_url = temp_this[1]  ;
            Play_urls = Play_urls + '<a href="javascript:void(0);"  onclick="PlaysThisUrl(this,' + json_i + ',&apos;' + fromLoalStorage + '&apos;)" class="button buttonmin " data-url="' + temp_this_url + '" data-from="' + Arr_Play_From[i] + '" data-name="' + JSON_vods[json_i].vod_name + '" data-jishu="' + temp_this[0] + '">' + temp_this[0] + '</a>';
        });
        Play_urls = Play_urls + '<div class="clear"></div>';
        Play_urls = Play_urls + '</div>';
        $('#Show_vodFromJson_to_html .PlayAllButtons .tabs').append(Play_urls);
    });
    var Show_vodFromJson_to_html = $("#Show_vodFromJson_to_html").html();
    $("#Show_Vod_to_guest").empty(); //先清空 要加载的位置 防止同名冲突
    $("#Show_Vod_to_guest").append(Show_vodFromJson_to_html); //填充
}
//关闭 并销毁一个临时层
function close_play_vod_popup() {
    //$("#iframe_palyer").attr("src", "");//避免后台播放
    $(".diviframeForJs").empty();//避免后台播放
    $.closeModal('.Show_Vod_to_guest_class'); //关闭
    $("#Show_Vod_to_guest_class").remove(); //销毁
}
//更新单独一级的信息的信息
function get_news_vod_info(int_vod_id){
    var temp=$(".updatethisvoding").html();

    if (int_vod_id>0){
        $(".updatethisvoding").show();
        $.ajax({
            url: api_vhost[WL]+"?ac=get_news_vod_info&vod_id="+int_vod_id,
            type: "post",
            dataType: "json",
            data: $('#userinfo_local').serialize(), //传送用户信息过去,
            beforeSend: function () {},
            success: function (r) {
                if (r.code == 1) {
                    $(".updatethisvoding").html("更新成功!");
                    console.log('后台更新影片成功');
                    setTimeout(function () {
                        $(".updatethisvoding").html(temp);
                        $(".updatethisvoding").hide();
                     }, 2000);
                    //把json存入
                    localStorage_played("", "", r.list[0]);
                    $("#Show_vodFromJson_to_html").empty(); //如果模板使用过清空模板
                    $("#Show_vodFromJson_to_html").append($("#Show_Vod_to_guest").html()); //填充
                    vod_json_html(localStor_name_u_played,r.list,0);
                }
                else {
                    $.toast("有问题"+r.msg);
                    $(".updatethisvoding").hide();
                }
            },
            error: function () {
                $.toast("网络出了一点问题");
                $(".updatethisvoding").hide();
            },
            complete: function () {}
        });

    }

}

//搜索 end
//处理 每一集的播放按钮
function PlaysThisUrl(buttonthis, json_i, fromLoalStorage) {
    var JSON_vods;
    if (fromLoalStorage == "search") {
        //从搜索结果里读取
        JSON_vods = JSON.parse(localStorage.getItem("searchList"));
    }
    if (fromLoalStorage == localStor_name_u_played) {
        //从历史记录里面读取
        JSON_vods = JSON.parse(localStorage.getItem(localStor_name_u_played));
    }
    if (fromLoalStorage == localStor_name_u_fav) {
        //从收藏记录
        JSON_vods = JSON.parse(localStorage.getItem(localStor_name_u_fav));
    }
    $(".fenji a").removeClass("button-fill");
    $(buttonthis).addClass("button-fill");
    //alert($(buttonthis).attr("data-url"));
    
    $("#Show_Vod_to_guest_class h1").html("正在播放 " + $(buttonthis).attr("data-jishu") + " " + $(buttonthis).attr("data-from") + " " + $(buttonthis).attr("data-name"));

    var get_parseServer=1
    if( parseInt(getCookie("parseServer"))>1){
        get_parseServer=parseInt(getCookie("parseServer"));
    }
    $.toast('正在连接 解析'+get_parseServer+'....')
    var this_players_url_arr=players_url[$(buttonthis).attr("data-from")]  ;
    // 0 英文名  1 中文名字 2 3 4 5 解析地址
    var this_parseServer_url=this_players_url_arr[get_parseServer+1]  ;
    if (this_parseServer_url=="-"){this_parseServer_url="";}
    //$("#iframe_palyer").attr("src", this_parseServer_url+$(buttonthis).attr("data-url"));
    $(".diviframeForJs").empty();
    //在electron win下有兼容问题，改用webview 判断 navigator.userAgent 中是否含有 Electron;
    var userAgent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
    if (userAgent.indexOf("electron") > -1 && userAgent.indexOf("windows") > -1) {
        //electron windows下打开新窗播放
        openUrl_in_newsWin(this_parseServer_url+$(buttonthis).attr("data-url"));
    }else if (userAgent.indexOf("electron") > -1 && userAgent.indexOf("macintosh") > -1) {
        //electron mac下打开新窗播放
        openUrl_in_newsWin(this_parseServer_url+$(buttonthis).attr("data-url"));
    }else{
        $(".diviframeForJs").html('<iframe  id="iframe_palyer" name="iframe_palyer" src="'+this_parseServer_url+$(buttonthis).attr("data-url")+'" allowfullscreen="true"></iframe>');

    }
    //更新播放记录 精确到每一集
    localStorage_played($(buttonthis).attr("data-jishu"), $(buttonthis).attr("data-url"), JSON_vods[json_i]);
}
//Electron中打开新窗口
function openUrl_in_newsWin(Str_url){
    const path = require("path");
    const electron = require("electron");
    let BrowserWindow = electron.remote.BrowserWindow;
    let PlayWin = null;
    PlayWin = new BrowserWindow ({width: 800, height:600})
    PlayWin.loadURL(Str_url);
    PlayWin.on("close", function(){PlayWin = null;});
}
//localStorage    更新观看记录
//localStorage_update_played();
function localStorage_update_played() {
    var str_json_get_played = "" + localStorage.getItem(localStor_name_u_played);
    var json_rows_temp = JSON.parse(str_json_get_played);
    var json_limitlength = getJsonLength(json_rows_temp); //获取到的条数
    $("#Played_ShoWLi").empty();//清空先
    //为空直接赋值
    if (str_json_get_played == null || str_json_get_played == "" || str_json_get_played == "null" || str_json_get_played == "[]") {
        //console.log("str_json_get_played:"+str_json_get_played);

        $("#list_played").hide();
        $(".No_played").show();//提示 没记录
    } else {
        $(".No_played").hide(); //不提示没记录
        $("#list_played").show();
        $("#page_played #listpic").show();//显示
        for (var json_i = 0; json_i < json_limitlength; json_i++) {
            Json_To_piclist_html(json_rows_temp[json_i], json_i, "#Played_ShoWLi", localStor_name_u_played); //处理格式化本条数据
        }
    }

    Check_and_modify();

}
// localStorage    观看记录 添加和更新
function localStorage_played(str_jishu, str_url, jsondata) {
   
        //如果点击选集按钮 就更新
    jsondata['played_jishu']=str_jishu;
    jsondata['str_url']=str_url;
    
    var is_has_Exist=0;//是否有重复
    var str_get_played=localStorage.getItem(localStor_name_u_played)
    if (str_get_played==null){
        //播放记录为空的话直接附加 前后用[] 代表多级
        localStorage.setItem(localStor_name_u_played,"["+JSON.stringify(jsondata)+"]");
    }else{
        //循环一下看看是否有多余
        jsonstr_get_played=JSON.parse(str_get_played);
        var str_news_palyer="";
        $.each(jsonstr_get_played, function () {  //循环一边剔除重复的
            if (this.vod_id ==jsondata.vod_id) {
                //有重复的检查一下 是否需要更新集数和地址
                if(str_jishu==""){
                    jsondata['played_jishu']=this.played_jishu;
                    jsondata['str_url']=this.str_url;
                }
            }else{
                if(str_news_palyer==""){
                    str_news_palyer=JSON.stringify(this); //第一条
                }else{
                    str_news_palyer=str_news_palyer+','+JSON.stringify(this);
                }
            }
        });
        //有重复的 所以把当前这个放到第一条
        str_news_palyer=JSON.stringify(jsondata)+','+str_news_palyer;

        str_news_palyer="["+str_news_palyer+"]"; //前后用[] 代表多级
        str_news_palyer = str_news_palyer.replace("},]", "}]"); //替换掉的多余的，
        str_news_palyer = str_news_palyer.replace("[, {", "[,{"); 
        localStorage.setItem(localStor_name_u_played, str_news_palyer);

    }

    localStorage_update_played();//更新播放记录显示
}


// localStorage    清空观看记录

function localStorage_del_played() {
    localStorage.removeItem(localStor_name_u_played);
    localStorage_update_played();//更新
    $.toast("观看记录已清空");

}
// localStorage    搜索记录
function localStorage_searchwd(searchwd) {
    if (searchwd) {
        var getItemSearchwd = "" + localStorage.getItem("searchwd");
        var arr_searchwd = getItemSearchwd.split("$$$");//拆分 
        var temp_words = "";
        $.each(arr_searchwd, function () {  //循环一边剔除重复的
            if (this != searchwd && this) {
                if (temp_words != "") {
                    temp_words = temp_words + "$$$" + this;
                } else {
                    temp_words = this;
                }
            }
        });
        if (temp_words != "") {
            localStorage.setItem("searchwd", temp_words);
        }
        var getItemSearchwd = "" + localStorage.getItem("searchwd");
        var arr_searchwd = getItemSearchwd.split("$$$");//拆分 
        var temp = "";
        //限定100k 1000000 20个记录
        if (getItemSearchwd.length < 100000 || arr_searchwd.length < 15) {
            if (localStorage.getItem("searchwd") == "null" || localStorage.getItem("searchwd") == null) {
                localStorage.setItem("searchwd", searchwd);
            }
            else {
                localStorage.setItem("searchwd", searchwd + "$$$" + localStorage.getItem("searchwd"));
            }
        } else {
            //删除最后一条
            localStorage.setItem("searchwd", searchwd + "$$$" + getItemSearchwd.replace("$$$" + arr_searchwd[arr_searchwd.length - 1], ""));
        }
        localStorage_update_searchwd(); //更新
    }
}
//localStorage 更新搜索记录 的显示
localStorage_update_searchwd();
function localStorage_update_searchwd() {
    var temphtml = "搜索历史：";
    var temp_seadrchwd = localStorage.getItem("searchwd");

    if (temp_seadrchwd) {
        arr_searchwd = temp_seadrchwd.split("$$$");//拆分 
        $.each(arr_searchwd, function () {  //循环播放器 以便调整顺序
            if (this && this != "null") {
                temphtml = temphtml + "<span>" + this + "</span> ";
            }
        });
        $("#YourKeywords").html(temphtml + "[<a href='javascript:localStorage_del_searchwd();'>删除</a>]<br />");//填充内容
    }
}
//localStorage 删除搜索记录
function localStorage_del_searchwd() {
    localStorage.removeItem("searchwd");
    $("#YourKeywords").empty();//清空
}

//获取json条数
function getJsonLength(jsonData) {
    var jsonLength = 0;
    for (var item in jsonData) {
        jsonLength++;
    }
    return jsonLength;
}
// 横竖屏   --end
//判断手机横竖屏状态：
var add_tr;
function HengShuPing() {
    if (window.orientation == 180 || window.orientation == 0) {
        //竖屏
        $("#No_hengping1").after(add_tr);//恢复之前删除 
        $("body").removeClass("HengPing");
        $("body").addClass("ShuPing");
        $("#page-loader .loader_logo").css("margin-top", "40%");

    }
    if (window.orientation == 90 || window.orientation == -90) {
        //横屏
        $("body").removeClass("ShuPing");
        $("body").addClass("HengPing");
        add_tr = $(".No_hengping1").detach();
        $("#page-loader .loader_logo").css("margin-top", "10%");
    }
}
//加载的时候先判断
HengShuPing();
//屏幕方向变化的时候
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", HengShuPing, false);



// 横竖屏   --end

//引导页跳转
var int_setInterval1;
if (window.location.hash == "#page-loader" || window.location.hash == "#page_dl_ios"  || window.location.hash == "") {
    int_setInterval1 = setInterval(function () {
        $('.loader_jump span').html($('.loader_jump span').html() - 1);
        if ($('.loader_jump span').html() <= 0) {
            gotoindex();
        }
    }, 1000);
}
function gotoindex() {
    int_setInterval1 = window.clearInterval(int_setInterval1);
    var u_info= JSON.parse(localStorage.getItem(localStor_name_u_info));

    if (u_info!=null){
       
        get_news_userinfo();//再强制获取一次用户数据
        $.router.load("#page-index");
    }else{
        $.router.load("#page-login");
        $.toast("请先登录");
    }
}

//复制到剪切板
var clipboard = new ClipboardJS('.btn_copy');
clipboard.on('success', function (e) {
    $.toast("复制成功，你可以粘贴到别处了");
    e.clearSelection();
});
clipboard.on('error', function (e) {
    $.toast("复制失败，请留言反馈给我们");

});
//复制到剪切板 end

// 功能完成提示
$(document).on('click', '.KaifaZhong', function () {
    $.toast("这个功能还不能使用，正在加紧升级中");
});
// 功能完成提示 end 




//重载app提示 reloadapp
$(document).on('click', '.reloadapp', function () {
    var arr_url=window.location.href.split("#");
    $.toast('App重载中..');
    window.location.href=arr_url[0]  ;
    
});




//多设备登录提示
$(document).on('click', '.FAQshebei', function () {
    $.alert('<div style="text-align: left;"><b>随便选个即可。</b><br/>如需同账号多设备登录,请选择不同的设备名登录。<br/>TV版使用预留设备(4)</div>', '设备选择说明');
});
function Show_device_Select() {
    if ($("#login_deviceID_list").css("display") == "none") {
        $("#login_deviceID_list").show();
        $("#login_deviceID").empty();
    } else {
        $("#login_deviceID_list").hide();
    }
}


//切换解析服务器 
function parseServer(buttonthis) {
    setCookie("parseServer", $(buttonthis).attr("data-server"));//写入cookis方便php读取
    set_parseServer();
    $.toast("解析切换成功，重新选集后生效");
}

//初始化解析服务器按钮
set_parseServer();
function set_parseServer() {
    var needsetid = getCookie("parseServer");
    if (needsetid == "") {
        needsetid = 1;
    }
    $(".parseServerbuttons   a").removeClass("button-fill");
    $(".parseServerbuttons  [data-server='" + needsetid + "']").addClass("button-fill");

}
//设置cookies
function setCookie(cname, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = cname + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}
//获取cookies
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
//注册
function u_reg() {
    var user_name = $.trim($("#u_reg input[name='user_name']").val()); //
    var uid = $.trim($("#u_reg input[name='uid']").val()); //
    var user_email = $.trim($("#u_reg input[name='user_email']").val()); //
    var user_pwd = $.trim($("#u_reg input[name='user_pwd']").val()); //
    var user_pwd2 = $.trim($("#u_reg input[name='user_pwd2']").val());
    if (uid == "") {
        $.toast("请填写邀请码");
    }
    else if (user_name == "") { $.toast("请填写用户名"); }
    else if (user_email == "") { $.toast("请填写邮箱"); }
    else if (user_pwd == "") { $.toast("请输入新密码"); }
    else if (user_pwd2 == "") { $.toast("请输入两次"); }
    else if (user_name.length < 5) { $.toast("用户名不能低于5个字"); }
    else if (user_pwd2.length < 6) { $.toast("密码太短了6位以上哦"); }
    else if (user_pwd != user_pwd2) { $.toast("两次密码填写不一致"); }
    else {
        $.ajax({
            url: api_vhost[WL]+"?ac=u_reg",
            type: "post",
            dataType: "json",
            data: $('#u_reg').serialize(),
            beforeSend: function () {
                $.toast('正在提交...')
            },
            success: function (r) {
                if (r.code == 1) {
                    //把json存入
                    
                    $.alert(r.msg+"请记住您的：<br/>用户名:" + user_name + " 密码:" + user_pwd2+"<br/>"+"<br/>现在为您登陆", '注册成功', function () {
                        gotopage("#page-index");
                    });
                    localStorage.removeItem(localStor_name_u_info);
                    localStorage.setItem(localStor_name_u_info, JSON.stringify(r.data[0]));
                    set_userinfo();//更新本地显示
                }
                else {
                    $.toast("提示：" + r.msg);
                }
            },
            error: function () {
                $.toast("网络出了一点问题");
            },
            complete: function () {
            }
        });
    }
}
//找回密码
function u_findpass() {
    var user_name = $.trim($("#u_findpass input[name='user_name']").val()); //
    var user_question = $.trim($("#u_findpass input[name='user_question']").val()); //
    var user_answer = $.trim($("#u_findpass input[name='user_answer']").val()); //
    var user_pwd = $.trim($("#u_findpass input[name='user_pwd']").val()); //
    var user_pwd2 = $.trim($("#u_findpass input[name='user_pwd2']").val());
    if (user_name == "") {
        $.toast("用户名要填写");
    }
    else if (user_question == "") { $.toast("请选或输入密保问题"); }
    else if (user_answer == "") { $.toast("请填写密保答案"); }
    else if (user_pwd == "") { $.toast("请输入新密码"); }
    else if (user_pwd2 == "") { $.toast("请输入两次"); }
    else if (user_pwd2.length < 6) { $.toast("密码太短了6位以上哦"); }
    else if (user_pwd != user_pwd2) {
        $.toast("两次密码填写不一致");
    } else {
        $.ajax({
            url: api_vhost[WL]+"?ac=u_findpass",
            type: "post",
            dataType: "json",
            data: $('#u_findpass').serialize(),
            beforeSend: function () {
                $.toast('正在提交...')
            },
            success: function (r) {
                if (r.code == 1) {
                    $.alert("新密码是：<br/>" + user_pwd2+"<br/>现在为您登陆", '密码重设成功', function () {
                        gotopage("#page-index");
                    });
                    localStorage.removeItem(localStor_name_u_info);
                    localStorage.setItem(localStor_name_u_info, JSON.stringify(r.data[0]));
                    set_userinfo();//更新本地显示
                }
                else {
                    $.toast("提示："+ r.msg);
                }
            },
            error: function () {
                $.toast("网络出了一点问题");
            },
            complete: function () {
            }
        });
    }


}
//用户pin登录
function u_save_login_pin() {
    var randomPin = $.trim($("#form_login_pin input[name='randomPin']").val()); //
    if (randomPin.length <4){
        $.toast('快捷码应是5-6位数字');
        return;
    }
    $.ajax({
        url: api_vhost[WL]+"?ac=u_save_login_pin&user_loginpin="+randomPin,
        type: "post",
        dataType: "json",
        data: $('#userinfo_local').serialize(), //传送用户信息过去,
        beforeSend: function () {
            $.toast('保存快捷码中...')
        },
        success: function (r) {
            if (r.code == 1) {
                $.toast("登录码输入成功");
                //把json存入
                $(".end_form_login_pin").html("你要登录的快捷码 "+randomPin+" ，设备如果没有自动登录请检查是否输入正确");
            }
            else {
                $.toast("有问题"+r.msg);
            }
        },
        error: function () {
            $.toast("网络出了一点问题");
        },
        complete: function () {
        }
    });
}
//用户登录
function u_login() {
    var user_name = $.trim($("#u_login input[name='user_name']").val()); //用户名
    var user_pwd = $.trim($("#u_login input[name='user_pwd']").val()); //密码
    var user_random = $("#u_login input[name='user_random']:checked").val(); //登录服务器
    if (user_name == "" || user_pwd == "") {
        $.toast("请填写用户名和密码");
    } else {
        $.ajax({
            url: api_vhost[WL]+"?ac=u_login",
            type: "post",
            dataType: "json",
            data: $('#u_login').serialize(),
            beforeSend: function () {
                $.toast('登录中...')
            },
            success: function (r) {
                if (r.code == 1) {
                    $.toast("登录成功");
                    //把json存入
                    localStorage.removeItem(localStor_name_u_info);
                    localStorage.setItem(localStor_name_u_info, JSON.stringify(r.data[0]));
                    set_userinfo();//更新本地显示
                    u_checkendtime();//自动升级
                    gotopage("#page-index");

                }
                else {
                    $.toast("用户名或者密码错误");
                }
            },
            error: function () {
                $.toast("网络出了一点问题");
            },
            complete: function () {
            }
        });


    }


}
//获取留言板列表
function gbook_list() {
    $.ajax({
        url: api_vhost[WL]+"?ac=gbook_list",
        type: "post",
        dataType: "json",
        data: $('#userinfo_local').serialize(),//传送用户信息过去,
        beforeSend: function () {
            $.toast('正在请求数据...')
        },
        success: function (r) {
            if (r.code == 1) {
                localStorage.setItem("gbook_list", JSON.stringify(r));
                $.toast("加载成功");
                var gbook_list = JSON.parse(localStorage.getItem("gbook_list"));
                $("#gbook_list_show").empty();
                $.each(gbook_list.list, function (i) {
                    $("#gbook_list_html .card-content-inner").html(this["gbook_name"] + "[" + format(this["gbook_time"]) + "]:<br> " + this["gbook_content"]);
                    if (this["gbook_reply"] == "") {
                        $("#gbook_list_html .card-footer").html("暂未回复");
                    } else {
                        $("#gbook_list_html .card-footer").html("管理员回复 [" + format(this["gbook_reply_time"]) + "]:" + this["gbook_reply"]);
                    }

                    $("#gbook_list_show").append($("#gbook_list_html").html());
                });
            }
            else {
                $.toast("提示：" + r.code + " " + r.msg);
            }
        },
        error: function () {
            $.toast("网络出了一点问题");
        },
        complete: function () {
        }
    });
}

//保存留言板
function gbook_save(str_gbookmsg) {
    var gbook_content;
    if (str_gbookmsg==''){
        gbook_content = $.trim($("#gbook_save textarea[name='gbook_content']").val()); 
    }else{
        gbook_content = str_gbookmsg; 
    }
    var Postdata=$("#userinfo_local").serialize()+"&gbook_content="+gbook_content;
    if (gbook_content.length < 5) {
        $.toast("留言内容太短了");
    } else if (gbook_content.length > 500) {
        $.toast("留言内容太多了，最多500个字哦");

    } else {
        $.ajax({
            url: api_vhost[WL]+"?ac=gbook_save",
            type: "post",
            dataType: "json",
            data: Postdata,
            beforeSend: function () {
                $.toast('正在提交...')
            },
            success: function (r) {
                if (r.code == 1) {
                    $.toast("提示：" + r.msg);
                }
                else {
                    $.toast("提示："  + r.msg);
                }
            },
            error: function () {
                $.toast("网络出了一点问题");
            },
            complete: function () {
            }
        });
    }


}

//日期戳改文本
function add0(m) { return m < 10 ? '0' + m : m }
function format(timestamp) {
    //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
    var time = new Date(parseInt(timestamp) * 1000);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
}

//新会员 自动升级 过期会员自动提示过期
u_checkendtime(); //检查会员过期
function u_checkendtime() {
    if (getCookie("user_id") > 1) {
        var u_info = JSON.parse(localStorage.getItem(localStor_name_u_info));
        if (u_info['user_end_time'] < (Date.parse(new Date())/ 1000) && u_info['user_end_time'] > 1) {
            //会员过期提醒
            $.confirm('是否去续费', '会员过期',
                function () {
                     gotopage("#page_u_upgrade");
                },
                function () {
                        $.toast("会员过期无法观影哦");
                }
            );
        }

    }

}
//升级会员 时长 是否返回对话框
function u_upgrade(str_long, int_return_alert) {

    if (str_long != "" || str_long != null) { //留空不执行
        $.ajax({
            url: api_vhost[WL]+"?ac=u_upgrade&long=" + str_long,
            type: "post",
            dataType: "json",
            data: $('#userinfo_local').serialize(), //传送用户信息过去,
            success: function (r) {
                if (r.code == 1) {
                    if (int_return_alert > 0) {$.toast("升级/续费成功");}
                    else{console.log("后台自动升级成功")}
                    localStorage.removeItem(localStor_name_u_info);
                    localStorage.setItem(localStor_name_u_info, JSON.stringify(r.data[0]));
                    set_userinfo();//更新本地显示
                }
                else {
                    if (int_return_alert > 0) {$.toast("提示：" + r.msg);}
                    else{console.log("后台升级错误:"+r.code + r.msg)}
                }
            },
            error: function () {
                if (int_return_alert > 0) {$.toast("网络出了一点问题");}
                else{console.log("网络出了一点问题");}
            },
            complete: function () {
            }
        });
    }
}
//升级会员 确认对话框
function u_upgrade_confirm(str_long) {
    var u_info = JSON.parse(localStorage.getItem(localStor_name_u_info));
    if (u_info.user_points < vip_setting[str_long]){

        $.toast("积分不足，您的积分："+u_info.user_points );

        return;

    }

    var confirmtxt = "确定用 " + vip_setting[str_long] + " 积分兑换会员吗？";
    $.confirm(confirmtxt, function () {
        u_upgrade(str_long, 1); //升级并返回结果
    });
    
}
//修改资料
function u_update() {
    var user_pwd = $.trim($("#u_update input[name='user_pwd']").val()); //密码
    var user_pwd1 = $.trim($("#u_update input[name='user_pwd1']").val());
    var user_pwd2 = $.trim($("#u_update input[name='user_pwd2']").val());
    var str_alert;
    if (user_pwd == "") {
        $.toast("请输入密码");
    } else if (user_pwd1 != user_pwd2) {
        $.toast("两次密码填写不一致");
    }
    else {
        var Postdata=$("#userinfo_local").serialize()+"&"+$('#u_update').serialize();

        $.ajax({
            url: api_vhost[WL]+"?ac=u_update",
            type: "post",
            dataType: "json",
            data: Postdata,
            beforeSend: function () {
                $.toast('修改中...')
            },
            success: function (r) {
                if (r.code == 1) {
                    $(".user_pwd").val("");
                    $(".user_pwd1").val("");
                    $(".user_pwd2").val("");

                    localStorage.removeItem(localStor_name_u_info);
                    localStorage.setItem(localStor_name_u_info, JSON.stringify(r.data[0]));
                    set_userinfo();//更新本地显示

                    if (user_pwd2 != "") {
                        $.alert("您修改了密码,新密码是：<br/>" + user_pwd2, '资料修改成功');
                    } else {
                        $.alert("资料修改成功");
                    }
                }
                else {
                    $.toast("提示：" + r.msg);
                }
            },
            error: function () {
                $.toast("网络出了一点问题");
            },
            complete: function () {
            }
        });


    }


}
//修改需要修改的ui用户信息 更新到app界面
if (window.location.hash == "#page-loader" || window.location.hash == "") {
    set_getinfo(0, 0);
} else { set_getinfo(1, 0); }
//修改需要修改的ui用户信息 更新到app界面 是否重定向  是否获取新数据
//老函数
function set_getinfo(int_go_to_login, int_isgetnew) {

    

}
//强制更新用户数据
function get_news_userinfo(){
    set_userinfo();//先解析一次 
    
    $.ajax({
        url: api_vhost[WL]+"?ac=u_newinfo",
        type: "post",
        dataType: "json",
        data: $('#userinfo_local').serialize(),
        success: function (r) {
            if (r.code == 1) {
                console.log("后台更新用户数据成功");
                //把json存入
                localStorage.removeItem(localStor_name_u_info);
                localStorage.setItem(localStor_name_u_info, JSON.stringify(r.data[0]));
                set_userinfo();//更新本地显示
            }
            else {
                console.log(r.msg);
            }
        },
        error: function () {
            console.log("后台获取用户信息失败");
        },
        complete: function () {
        }
    });
}
//添加收藏夹
function u_fav_add(vod_id){
    $(".vodid_"+vod_id+" .addfav").hide();
    $(".vodid_"+vod_id+" .delfav").show();
    $.toast("添加收藏");
    $.ajax({
        url: api_vhost[WL]+"?ac=u_fav_add&vod_id=" + vod_id,
        type: "post",
        dataType: "json",
        data: $('#userinfo_local').serialize(), //传送用户信息过去,
        success: function (r) {
            if (r.code == 1) {
                console.log(r.msg);
            }
            else {
                console.log(r.msg);
            }
        },
        error: function () {
            console.log("后台点击收藏失败");
        }
    });
}
//获取收藏夹数据
function u_fav_list(){
    var temp_json=[]  ;
    $.ajax({
        url: api_vhost[WL]+"?ac=u_fav_list",
        type: "post",
        dataType: "json",
        data: $('#userinfo_local').serialize(), //传送用户信息过去,
        success: function (r) {
            if (r.code == 1) {
                localStorage.removeItem(localStor_name_u_fav);
                localStorage.setItem(localStor_name_u_fav, JSON.stringify(r.list));
                localStorage_update_fav();
            }else if(r.code == 100){
                $(".No_fav").html("你还没有收藏过影片");
                $(".No_fav").show();
            }
            else {
                console.log(r.msg);
            }
        },
        error: function () {
            console.log("收藏夹列表获取失败");
        }
    });
}
//更新收藏夹
function  localStorage_update_fav(){
    var str_json_get_played = "" + localStorage.getItem(localStor_name_u_fav);
    var json_rows_temp = JSON.parse(str_json_get_played);
    var json_limitlength = getJsonLength(json_rows_temp); //获取到的条数
    $("#fav_ShoWLi").empty();//清空先
    //为空直接赋值
    if (str_json_get_played == null || str_json_get_played == "" || str_json_get_played == "null" ||str_json_get_played == "undefined" || str_json_get_played == "[]") {
        //console.log("str_json_get_played:"+str_json_get_played);

        $("#list_fav").hide();
        $(".No_fav").show();//提示 没记录
    } else {
        $(".No_fav").hide(); //不提示没记录
        $("#list_fav").show();
        $("#page_fav #listpic").show();//显示
        for (var json_i = 0; json_i < json_limitlength; json_i++) {
            if(json_rows_temp[json_i])
            {
                Json_To_piclist_html(json_rows_temp[json_i], json_i, "#fav_ShoWLi", localStor_name_u_fav); //处理格式化本条数据
            }
        }
    }

    Check_and_modify();
}
//删除收藏夹
function u_fav_del(vod_id){
    $.confirm('确定要删除此条收藏?', function () {
        //先移除
        
        var json_rows_temp = JSON.parse(localStorage.getItem(localStor_name_u_fav));
        var json_limitlength = getJsonLength(json_rows_temp); //获取到的条数
        if (json_limitlength>0){
            for (var json_i = 0; json_i < json_limitlength; json_i++) {
                if(json_rows_temp[json_i]){
                    if (json_rows_temp[json_i]['vod_id']==vod_id){
                        delete json_rows_temp[json_i]  ;
                    }
                }
            }
        }
        localStorage.removeItem(localStor_name_u_fav);
        localStorage.setItem(localStor_name_u_fav, JSON.stringify(json_rows_temp));

        localStorage_update_fav();//先显示 后更新

        $.ajax({
            url: api_vhost[WL]+"?ac=u_fav_del&vod_id=" + vod_id,
            type: "post",
            dataType: "json",
            data: $('#userinfo_local').serialize(), //传送用户信息过去,
            success: function (r) {
                if (r.code == 1) {
                    console.log("后台删除收藏夹成功");
                }
                else {
                    console.log(r.msg);
                }
            },
            error: function () {
                console.log("后台删除收藏夹失败");
            }
        });
     });
    
}
//检查和修改
function Check_and_modify(){
    //检查收藏夹匹配
    var str_get="";
    var json_rows=null;
    var json_length=0;
    var i=0;

     str_get = "" + localStorage.getItem(localStor_name_u_fav);
     json_rows = JSON.parse(str_get);
     json_length = getJsonLength(json_rows); //获取到的条数
     $(".addfav").show();  //必须初始化一次不然经常出问题
     $(".delfav").hide();  //必须初始化一次不然经常出问题
    if (str_get != null && str_get != "" && str_get != "null" && str_get != "[]") {
        for ( i = 0; i < json_length; i++) {
            if(json_rows[i]){
                $(".vodid_"+json_rows[i].vod_id+"  .addfav").hide(); 
                $(".vodid_"+json_rows[i].vod_id+"  .delfav").show(); 
            }
        }
    } 
    json_rows=null;

    //检查播放记录匹配
    str_get = "" + localStorage.getItem(localStor_name_u_played);
    json_rows = JSON.parse(str_get);
    json_length = getJsonLength(json_rows); //获取到的条数
    $(".nextpalyed").empty(); 
    if (str_get != null && str_get != "" && str_get != "null" && str_get != "[]") {
        for ( i = 0; i < json_length; i++) {
            if(json_rows[i].played_jishu){
                $(".vodid_"+json_rows[i].vod_id+" .nextpalyed").html("上次播放："+json_rows[i].played_jishu); 
            }else{
                $(".vodid_"+json_rows[i].vod_id+" .nextpalyed").empty(); 
            }
        }
    } 

}
//解析用户数据 到html
//因为ajax异步所以这里单独写一个函数执行
function set_userinfo() {
    var u_info = JSON.parse(localStorage.getItem(localStor_name_u_info));
    if (u_info==null) {
        $(".notlogin").show();
        $(".logined").hide();
    } else {
        $(".notlogin").hide();
        $(".logined").show();
    }
    $(".user_name").html(u_info.user_name);
    if (u_info.user_end_time <  (Date.parse(new Date())/ 1000) ) {
        $(".group_name").html("过期会员"); //会员组
    }else{
        $(".group_name").html(vip_setting.vipname); //至尊会员
    }
    $(".user_end_time").html(format(u_info.user_end_time));
    $(".user_name_input").val(u_info.user_name);
    $(".user_id_input").val(u_info.user_id);
    $(".user_email").val(u_info.user_email);
    $(".user_question").val(u_info.user_question);
    $(".user_answer").val(u_info.user_answer);
    $(".user_points").html(u_info.user_points);
    $(".user_points_froze").html(u_info.user_points_froze);
    $(".user_reg_time").html(u_info.user_reg_time);
    $(".user_last_login_time").html(u_info.user_last_login_time);
    $(".user_pid").html(u_info.user_pid);
    $(".user_pid_2").html(u_info.user_pid_2);
    $(".user_pid_3").html(u_info.user_pid_3);
    $(".user_loginpin").html(u_info.user_loginpin);

    $(".user_id_span").html(u_info.user_id);
    //用户数据
    $(".local_user_id").val(u_info.user_id);
    $(".local_userkey").val(u_info.local_userkey);

    $(".local_user_name").val(u_info.user_name);
    $(".local_page_random").val(u_info.local_page_random);
    $(".local_user_verifynum").val(u_info.local_user_verifynum);
    $(".local_device_id").val(u_info.local_device_id);
}
// 确定修改密码
$(document).on('click', '.x_user_pwd', function () {
    if ($('.user_pwd1_2').css('display') == "none") {
        $(".x_user_pwd").html("取消"); //
        $(".user_pwd1_2").show();
        $(".user_pwd").attr("placeholder", "请输入旧密码");
        $(".user_pwd1").val("");
        $(".user_pwd2").val("");

    } else {
        $(".x_user_pwd").html("修改");
        $(".user_pwd").attr("placeholder", "请输入密码");
        $(".user_pwd1_2").hide();
        $(".user_pwd1").val("");
        $(".user_pwd2").val("");
    }
});
// 选择修改问题
$(document).on('click', '.x_user_question', function () {
    var buttons1 = [
        {
            text: '请选择一个问题',
            label: true
        },
        {
            text: '您印象最深的老师的名字是？', onClick: function () {
                $(".user_question_forselect").val("您印象最深的老师的名字是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }
        }, {
            text: '您的第一辆车的型号是？', onClick: function () {
                $(".user_question_forselect").val("您印象最深的老师的名字是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }

        }, {
            text: '您最喜爱的宠物的名字是？', onClick: function () {
                $(".user_question_forselect").val("您最喜爱的宠物的名字是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }
        }, {
            text: '您父母认识的地点是？', onClick: function () {
                $(".user_question_forselect").val("您父母认识的地点是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }
        }, {
            text: '您初恋的名字是？', onClick: function () {
                $(".user_question_forselect").val("您初恋的名字是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }
        }, {
            text: '您和您的伴侣认识的地址点是？', onClick: function () {
                $(".user_question_forselect").val("您和您的伴侣认识的地址点是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }
        }, {
            text: '您幼儿园校园名字是？', onClick: function () {
                $(".user_question_forselect").val("您幼儿园校园名字是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }
        }, {
            text: '您的一个QQ号码是？', onClick: function () {
                $(".user_question_forselect").val("您的一个QQ号码是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }
        }, {
            text: '您的第一个手机号码是？', onClick: function () {
                $(".user_question_forselect").val("您的第一个手机号码是？");
                $(".user_question_forselect").attr("readonly", "readonly");
            }
        }
    ]  ;
    var buttons3 = [
        {
            text: '---自定义一个问题---',
            color: 'danger', onClick: function () {
                $(".user_question_forselect").val("");
                $(".user_question_forselect").removeAttr("readonly");
            }
        }
    ]  ;
    var buttons2 = [
        {
            text: '取消',
            bg: 'danger'
        }
    ]  ;
    var groups = [buttons1, buttons3, buttons2]  ;
    $.actions(groups);
}); 