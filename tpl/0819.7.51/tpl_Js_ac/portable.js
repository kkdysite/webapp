
var int_setInterval;
var int_setInterval_fav;

$('body').addClass('theme-dark');
get_new_favlist();

function get_new_favlist() { 
    if (localStorage.getItem(localStor_name_u_portable_fav)) 
    { 
        set_userinfo(); 
        clearInterval(int_setInterval);
        u_fav_list(); 
        $.router.load("#page_fav");
    }else{
        $.ajax({ 
            url: api_vhost[WL]+"?ac=u_login_get_pin", 
            type: "post", dataType: "json", 
            data: $('#userinfo_local').serialize(), 
            success: function (r) { 
                if (r.code == 1) { $("#user_loginpin").html(r.user_loginpin); 
                int_setInterval = setInterval("clock_u_login_pin_check()", 1500); 
                } else { $.toast("无法获取登录码"); } 
            }, 
            error: function () { $.toast("网络问题，无法获取登录码"); } 
        });
    }
}
//获取收藏夹数据
function u_fav_list() {
    var temp_json = []  ;
    $.ajax({
        url: api_vhost[WL]+"?ac=u_fav_list",
        type: "post",
        dataType: "json",
        data: $('#userinfo_local').serialize(), //传送用户信息过去,
        success: function (r) {
            if (r.code == 1) {
                localStorage.removeItem("u_fav_tvlist2020");
                localStorage.setItem("u_fav_tvlist2020", JSON.stringify(r.list));
                localStorage_update_fav();
            } else if (r.code == 100) {
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
function localStorage_update_fav() { var str_json_get_played = "" + localStorage.getItem("u_fav_tvlist2020"); var json_rows_temp = JSON.parse(str_json_get_played); var json_limitlength = getJsonLength(json_rows_temp); $("#fav_Show_li").empty(); if (str_json_get_played == null || str_json_get_played == "" || str_json_get_played == "null" || str_json_get_played == "[]") { $("#list_fav").hide(); $(".No_fav").show(); } else { $(".No_fav").hide(); $("#list_fav").show(); $("#page_fav #listpic").show(); for (var json_i = 0; json_i < json_limitlength; json_i++) { Json_To_piclist_html(json_rows_temp[json_i], json_i, "#fav_Show_li", "u_fav_tvlist2020"); } } }
function open_vod_fromJson(json_i, fromLoalStorage) {
    var JSON_searchList
    if (fromLoalStorage == "u_fav_tvlist2020") { JSON_searchList = JSON.parse(localStorage.getItem("u_fav_tvlist2020")); }
    $(".PlayAllButtons .name").empty(); $(".listFrom_fenji").empty(); $(".PlayAllButtons .name").html(JSON_searchList[json_i].vod_name + " 请选集播放"); var Play_From = ""; var Play_urls = ""; if (JSON_searchList[json_i].vod_play_from == "") { $(".listFrom_fenji").html("本视频暂只能下载后观看"); } else { var reg_from = new RegExp('\\$\\$\\$', "g"); var Arr_Play_From = JSON_searchList[json_i].vod_play_from.replace(reg_from, ',').split(","); var Arr_vod_play_url = JSON_searchList[json_i].vod_play_url.split('$$$'); var jsonText = JSON.stringify(players_url); var frist_frome; $.each(players_url, function (players_url_i, thispaly) { $.each(Arr_Play_From, function (i) { if ($.trim(thispaly[0]) == $.trim(this)) { Play_From = Play_From + '<div class="from">' + thispaly[1] + '</div>'; Play_From = Play_From + '<div class="fenji">'; $.each(Arr_vod_play_url[i].split("#"), function (ii) { temp_this = this.split("$"); temp_this_url = temp_this[1]  ; Play_From = Play_From + '<a href="javascript:void(0);"  onclick="PlaysThisUrl(this,' + json_i + ',&apos;' + fromLoalStorage + '&apos;)" class="button buttonmin " data-url="' + temp_this_url + '" data-from="' + Arr_Play_From[i] + '" data-name="' + JSON_searchList[json_i].vod_name + '" data-jishu="' + temp_this[0] + '">' + temp_this[0] + '</a>'; }); Play_From = Play_From + '</div">'; } }); }); $(".listFrom_fenji").html(Play_From); }
}
function PlaysThisUrl(buttonthis, json_i, fromLoalStorage) {
    var JSON_searchList; if (fromLoalStorage == "search") { JSON_PlaysThisUrl = JSON.parse(localStorage.getItem("searchList")); }
    if (fromLoalStorage == "played") { JSON_PlaysThisUrl = JSON.parse(localStorage.getItem("played")); }
    if (fromLoalStorage == "u_fav_tvlist2020") { JSON_PlaysThisUrl = JSON.parse(localStorage.getItem("u_fav_tvlist2020")); }
    $(".fenji a").removeClass("button-fill"); $(buttonthis).addClass("button-fill"); $("#Show_Vod_to_guest_class h1").html("正在播放 " + $(buttonthis).attr("data-jishu") + " " + $(buttonthis).attr("data-from") + " " + $(buttonthis).attr("data-name")); var get_parseServer = 1
    if (parseInt(getCookie("parseServer")) > 1) { get_parseServer = parseInt(getCookie("parseServer")); }
    $.toast('正在连接解析' + get_parseServer + '....')
    var this_players_url_arr = players_url[$(buttonthis).attr("data-from")]  ; var this_parseServer_url = this_players_url_arr[get_parseServer + 1]  ; if (this_parseServer_url == "-") { this_parseServer_url = ""; }

    $(".diviframeForJs").html('<iframe  id="iframe_palyer" name="iframe_palyer" src="' + this_parseServer_url + $(buttonthis).attr("data-url") + '" allowfullscreen="true"></iframe>');


}
function Json_To_piclist_html(Json_row, json_i, append_To, fromLoalStorage) { $('#listpic_html_li .item-pic').attr('style', 'background-image:url(' + Json_row.vod_pic + ')'); $('#listpic_html_li .item-title').html(Json_row.vod_name); $("#listpic_html_li .link").attr("onclick", "open_vod_fromJson(" + json_i + ",'" + fromLoalStorage + "');"); $("#listpic_html_li #thisvod").attr("class", "vodid_" + Json_row.vod_id); $("#listpic_html_li .addfav").attr("onclick", "u_fav_add(" + Json_row.vod_id + ");"); $("#listpic_html_li .delfav").attr("onclick", "u_fav_del(" + Json_row.vod_id + ");"); $(append_To).append($("#listpic_html_li").html()); }
function getJsonLength(jsonData) {
    var jsonLength = 0; for (var item in jsonData) { jsonLength++; }
    return jsonLength;
}
function clock_u_login_pin_check() {
    $.ajax({
        url: api_vhost[WL]+"?ac=u_login_pin_check&user_loginpin=" + $("#user_loginpin").html(), type: "post", dataType: "json", data: $('#userinfo_local').serialize(), success: function (r) {
            if (r.code == 1) {
                $.router.load("#page_fav")
                $.toast("登录成功");
                localStorage.removeItem(localStor_name_u_portable_fav);
                localStorage.setItem(localStor_name_u_portable_fav, JSON.stringify(r.data[0]));
                set_getinfo(0, 0);
                u_fav_list();
                int_setInterval_fav = setInterval("u_fav_list()", 5000);
                clearInterval(int_setInterval);
            }
        }, error: function () { $.toast("网络问题，无法检查"); clearInterval(int_setInterval); clearInterval(int_setInterval_fav); }
    });
}
function u_loginout() {
    localStorage.removeItem(localStor_name_u_portable_fav);
    $(".local_user_id").val(0);
    $(".local_user_pwd").val(0);
    $(".local_page_random").val(0);
    clearInterval(int_setInterval_fav);
    $.toast("已退出，请重新登录");
    var arr_url = window.location.href.split("#");
    window.location.href = arr_url[0]  ;
}
function set_getinfo(int_go_to_login, int_isgetnew) { set_userinfo(); }
function set_userinfo() {
    var u_info = JSON.parse(localStorage.getItem(localStor_name_u_portable_fav));



    //用户数据
    $(".local_user_id").val(u_info.user_id);
    $(".local_userkey").val(u_info.local_userkey);

    $(".local_user_name").val(u_info.user_name);
    $(".local_page_random").val(u_info.local_page_random);
    $(".local_user_verifynum").val(u_info.local_user_verifynum);
    $(".local_device_id").val(u_info.local_device_id);
}
function parseServer(buttonthis) { setCookie("parseServer", $(buttonthis).attr("data-server")); set_parseServer(); $.toast("解析切换成功，重新选集后生效"); }
set_parseServer(); function set_parseServer() {
    var needsetid = getCookie("parseServer"); if (needsetid == "") { needsetid = 1; }
    $(".parseServerbuttons   a").removeClass("button-fill"); $(".parseServerbuttons  [data-server='" + needsetid + "']").addClass("button-fill");
}
function setCookie(cname, value) { var Days = 30; var exp = new Date(); exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000); document.cookie = cname + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/"; }
function getCookie(cname) {
    var name = cname + "="; var ca = document.cookie.split(';'); for (var i = 0; i < ca.length; i++) { var c = ca[i].trim(); if (c.indexOf(name) == 0) return c.substring(name.length, c.length); }
    return "";
}
function add0(m) { return m < 10 ? '0' + m : m }
function format(timestamp) { var time = new Date(parseInt(timestamp) * 1000); var year = time.getFullYear(); var month = time.getMonth() + 1; var date = time.getDate(); var hours = time.getHours(); var minutes = time.getMinutes(); var seconds = time.getSeconds(); return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds); }