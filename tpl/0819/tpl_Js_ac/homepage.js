
var user_agent = navigator.userAgent.toLowerCase();
//如果默认打开注册页面的话 就优先显示注册
if (MYURL[1]){
    if (MYURL[1]=='page_reg'){
        $('#page_index').removeClass('page-current');
        $("#page_reg").addClass('page-current'); 
    }
}
//如果有邀请码
qrcode_txt=MYURL[0];
if(UID){
    sessionStorage.setItem("reg_uid", UID);
    qrcode_txt=window.location.href.split("?")[0]+"?uid="+UID;
}
if(sessionStorage.getItem("reg_uid")){$('input[name="uid"]').val(sessionStorage.getItem("reg_uid"));}
jQuery('#shap_qrcode').qrcode({
    render: "table", //也可以替换为 table
    foreground: "#000",
    text: qrcode_txt
    //text: 'http://baidu.com'
});

$('.shap_qrcode').html($('#shap_qrcode').html());

var Portable_html = "因为我们没有办法适配所有设备，所以我们提供了免安装版本，在无法正常安装客户端的设备上你可以尝试直接使用浏览器打开使用<br><span class='copy_url_txt' id='Tvurl'>http://t.kkdy.website/</span><a href='#' data-clipboard-action='copy' class='copyTvurl' data-clipboard-target='#Tvurl'>复制地址</a>&nbsp;支持大部分智能设备。<br>&nbsp;&nbsp;注意1：免安装版本只有基本的观影功能。需要配合手机客户端使用<br>&nbsp;&nbsp;注意2：机顶盒使用地址要填写完整包括http以及后面的冒号斜杠。<br>旧版机顶盒如果无法直接使用，请使用第三方电视浏览器。比如：电视家浏览、艾克思浏览器，支持鼠标的机顶盒请也可以尝试使用安卓版或者chrome等专业浏览器";
var p_set = {
        'android': {
            'name': '安卓手机','button_name': "下载安卓版",'dl_link_name': '下载 看看电影.apk',
            'dl_link_url': 'https://cdn.jsdelivr.net/gh/kkdysite/webapp/ClientApp/kkdy.Phone.2.2.apk',
            'html': "下载后是apk文件，请在设置中允许安装未知来源的应用程序，否则不能安装。   <br>   部分设备提示版本更新，忽略即可。不影响正常使用。   <br>   通常在 系统设置 找到 未知来源 并勾选，不同品牌手机设置项目位置差异大，在设置中搜索或查看 系统安全 或 应用程序配置 或 未知来源应用权限管理列表 等位置。因为没有在对应品牌的安卓手机市场上架，所以需要允许安装未知来源软件。   "
        },
        'windows': {
            'name': 'Win电脑','button_name': "下载Win电脑版",'dl_link_name': '下载 看看电影 安装包',
            'dl_link_url': 'https://kkdy.lanzous.com/b00trimah',
            'html': "部分电脑可能会提示检查风险，请点其他 允许运行即可。 <br> 注意：基于win10开发，兼容win7（需要用兼容性模式运行) "
        },
        'mac': {
            'name': 'mac电脑','button_name': "下载mac版本",'dl_link_name': '下载 看看电影.app',
            'dl_link_url': 'https://kkdy.lanzous.com/b00trik8d',
            'html': "mac版下载后解压，打开访达，拖动到应用程序里面。首次运行可能会提示安全风险，在系统偏好设置 安全与隐私 打开。以后打开不会再继续提示。<br>仅支持macos10.12 以后的系统。更低版本请使用免安装版"
        },
        'ios': {
            'name': 'IOS设备','button_name': "安装ios版本",'dl_link_name': '','dl_link_url': '',
            'html': '因为苹果系统诸多限制，此类app不可以通过常规方式安装。<br><span class="nosafari nosafari_install_html"></span><span class="issafari">请您认真阅读下面的信息，按照提示进行安装。<br>本app在ios系统上用的是桌面书签的安装方式，首先需要确保是使用的手机自带的safari浏览器打开的本页，然后需要:<br>逐个点击下面的两个按钮，然后在弹出的页面中按照提示创建两个桌面图标。其中一个作为常用，另外一个在常用打不开的时候选择使用。</span>'
        },
        'unix': {
            'name': 'unix设备','button_name': "使用免安装版",'dl_link_name': '','dl_link_url': '',
            'html': Portable_html
        },
        'linux': {
            'name': 'linux电脑','button_name': "使用免安装版",'dl_link_name': '','dl_link_url': '',
            'html': Portable_html
        },

        'other': {
            'name': '未识别成功',
            'button_name': "使用免安装版",
            'dl_link_name': '',
            'dl_link_url': '',
            'html': Portable_html
        },

        'tv': {
            'name': 'tv版本',
            'button_name': "使用免安装版",
           
            'dl_link_name': '',
            'dl_link_url': '',
            'html': "机顶盒首选使用安卓版本，如果不可以使用请选择免安装版本<br>" + Portable_html
        },

        'Portable': {
            'name': '免安装版本',
            'button_name': "使用免安装版",
           
            'dl_link_name': '',
            'dl_link_url': '',
            'html': "" + Portable_html
        },
    };
    $('.alldownloadlink').html($("#all_dl_links_tpl").html()); //复制下载地址链接
   

    var temp_html;
    $.each(p_set, function (name, value) {
        $('.page-group').append(' <div class="page" id="page_dl_' + name + '"></div>'); //创建路由页
        $('#page_dl_' + name).html($("#page_dl_tpl").html()); //从模板复制内容
        temp_html = '';
        if (value['dl_link_name'] != "") {
            temp_html += '<a href="' + value['dl_link_url'] + '" class="dl button button-big button-fill button-success dl_link_name" target="_bank"  external>' + value['dl_link_name'] + '</a>';
        }

        if (value['html'] != "") {
            temp_html += value['html'];
        }

        $('#page_dl_' + name + ' .htmls').html(temp_html);
    });

    var p_name =getos();

    $('.p_name').html(p_set[p_name]['name']);//提示设备
    $('.tuijianlink').html(p_set[p_name]['button_name']); //推荐下载名称
    $('.tuijianlink').attr('href', '#page_dl_'+p_name); //推荐按钮的链接
    $('.gotoindex').attr('href', '#page_dl_'+p_name); //推荐按钮的链接
    $('#page_dl_'+p_name+" .gotoindex").hide();//隐藏无用的推荐链接 gotoindex
    $('.bef_tuijianlink').html("推荐你选择<br>");
    $('.nosafari').show(); 
    $('.nosafari_install_html').html('你只能通过苹果设备自带的Safari浏览器打开本页面才可以继续安装。')

        //检测 ios的safari
    if(p_name=='ios'){
        console.log("确定是ios");
        if( /safari/.test(user_agent) && !/chrome/.test(user_agent)  ){
            console.log("判断是Safari 且不是 chrome内核的qq 360等");
            $('.tuijianlink').attr('href', '?v=web-ios202008#page_dl_'+p_name); //推荐按钮的链接 
            $('.alldownloadlink .ios').attr('href', '?v=web-ios202008#page_dl_'+p_name); //推荐按钮的链接 
          //  $('.tuijianlink').attr('external', 'external'); //推荐按钮的链接 external
            $('.nosafari').hide(); //隐藏不是Safari的提示
            $('.issafari').show(); //打开安装提示
            if (MYURL[1]=='page_safari'){ //如果ios直接用safari打开了
                window.location.href=MYURL[0]+"#page_index";//跳转回首页
            }
        }else{
            $('.nosafari').show();
            $('.nosafari_install_html').html('你只能通过苹果设备自带的Safari浏览器打开本页面才可以继续安装。<a href="#page_safari">查看如何用safari打开？<a>')
            $('.issafari').hide(); //打开安装提示
            $('.tuijianlink').html("查看如何用Safari打开"); //推荐下载名称
            $('.tuijianlink').attr('href', '#page_safari'); //推荐按钮的链接
            $('.bef_tuijianlink').html('你可以继续注册账号或者查看其他信息。但是iPhone和ipad因为系统限制，不允许此类app在第三方浏览器上完成客户端安装，如果要安装客户端，请使用手机自带的Safari浏览器打开本页面。');
        
        }
        var open_safari_html='';
        //判断是否在微信或者qq里面
        if( (/micromessenger/.test(user_agent) ) ||  (/qq/.test(user_agent) ) ) { //微信
            open_safari_html='如果是在微信或QQ中打开的，点击屏幕右上角的三个点，在弹出的菜单中选择 类似指南针的图标，在 Safari 中 打开 即可。<img src="https://cdn.jsdelivr.net/gh/kkdysite/webapp/img/open_from_wechat_qq.jpg" /><br>或者';
        }
        
        open_safari_html+='复制本页面地址，返回手机桌面，找到 Safari 打开，地址栏输入地址。<div class="copy_url_txt" id="myurl">'+MYURL[0]+'</div> <a href="#" data-clipboard-action="copy" class="copymyurl" data-clipboard-target="#myurl">复制地址</a><br><img src="https://cdn.jsdelivr.net/gh/kkdysite/webapp/img/open_safari_fromdesktop.jpg" />';
        $('#page_safari .htmls').html(open_safari_html);
    }

    if( (/micromessenger/.test(user_agent) ) ||  (/qq/.test(user_agent) ) ) { //微信
        $('.dl_link_name').attr('href', 'javascript:alert("QQ或微信内无法下载，请用浏览器打开本页")');
    }

    //dl_link_name

    function getos() {
        
        if (/(iphone|ipad|ipod|ios)/i.test(user_agent)) {
            return 'ios';
        } else if (/(android)/i.test(user_agent)) {
            return 'android';
        }
        else if (/(windows)/i.test(user_agent)) {
            return 'windows';
        }
        else if (/(macintosh)/i.test(user_agent)) {
            return 'mac';
        }
        else if (/(unix)/i.test(user_agent)) {
            return 'unix';
        }
        else if (/(linux)/i.test(user_agent)) {
            return 'linux';
        }
        else {
            return 'other';
        };
    }


//复制到剪切板
var clipboard = new ClipboardJS('.copymyurl');
clipboard.on('success', function (e) {
    $.toast("复制成功，你可以粘贴到Safari了");
    e.clearSelection();
});
clipboard.on('error', function (e) {
    $.toast("复制失败，请手动复制");

});


var clipboard = new ClipboardJS('.copyTvurl');
clipboard.on('success', function (e) {
    $.toast("复制成功，你可以粘贴到别处了");
    e.clearSelection();
});
clipboard.on('error', function (e) {
    $.toast("复制失败，请手动复制");

});





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
                    $.alert(r.msg+"请记住您的：<br/>用户名:" + user_name + " 密码:" + user_pwd2+"<br/>"+"<br/>请下载app使用此账号登录", '注册成功', function () {
                    });
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