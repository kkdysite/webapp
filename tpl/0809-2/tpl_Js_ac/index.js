var MYURL=window.location.href.split("#");  //首页地址
if (!MYURL[1]){MYURL[1]='';} //赋值下标1
var Get_v=getQueryVariable('v');//获取url的v

var UID=getQueryVariable('uid');//获取url的v

$("body").empty(); //先清空body

$(document).on("pageInit", function(e, pageId, $page) {
    console.log(pageId);
    //在 直接点击的情况下会产生 page-1597804380293 1597804457893 这样的临时page-id
    if (/(page-)/i.test(pageId)) {
        if (Number( pageId.replace('page-','')) >100){
            get_ios_install();
        }
    }
});
if (sessionStorage.getItem("ios_install")){
    sessionStorage.removeItem('ios_install');
    alert('请勿刷新本页，无法继续安装，请重新操作');
    window.location.href=window.location.href.split("?")[0];
}


if(window.location.host==Portable_url || Get_v=="tv"){ //域名相符 或者v=tv
    get_portable();
}else if(!Get_v ){ 
    get_homepage();
}else{
    get_webapp();
}
/* 打开免安装版本 */
function get_portable(){
    alert("Portable_url"); //tv版本
}
function get_ios_install(){
    $("title").html(app_name[WL]);
    $.getScript(tpl_Js_html[WL]+'homepage_ios_install_html.js?'+static_file_suffix, function(){
        $("body").html(text);
        $('body').append('<link rel="stylesheet" href="'+tpl_css[WL]+'homepage.css'+static_file_suffix+'">'); 
        sessionStorage.setItem("ios_install", '1') 
    });
}
/* 打开首页 */
function get_homepage(){
    $.getScript(tpl_Js_html[WL]+'homepage_html.js?'+static_file_suffix, function(){
        $("body").html(text);
        $('body').append('<link rel="stylesheet" href="'+tpl_css[WL]+'homepage.css'+static_file_suffix+'">'); 
        $.getScript(tpl_Js_ac[WL]+'homepage.js?'+static_file_suffix, function(){});

    });
}
/*   打开webapp */
function get_webapp(){
    $("title").html(app_name[WL]);
    $.getScript(tpl_Js_html[WL]+'webapp_html.js?'+static_file_suffix, function(){
        $("body").html(text);
        $('body').append('<link rel="stylesheet" href="'+tpl_css[WL]+'webapp.css'+static_file_suffix+'">'); 
        $.getScript(tpl_Js_ac[WL]+'webapp.js?'+static_file_suffix, function(){});

    });
}
//获取url参数
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
    return(false);
}