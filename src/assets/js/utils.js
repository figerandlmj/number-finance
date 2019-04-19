// 获取当前页面的URL 对其带的参数进行处理
function getUrlPara(para) {
  let paraArr = decodeURIComponent(location.search).substring(1).split('&');
  for(let i = 0; i < paraArr.length; i++) {
    let arr = paraArr[i].split('=');
    if(arr[0] === para) {
      return arr[1];
    }
  }
  return '';
}

// 判断手机系统，1为android，2为ios
function getOsFrom() {
  let u = navigator.userAgent;
  // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 || u.indexOf("Linux") > -1; //android终端
  let isiOS = (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) || u.indexOf('iPhone') > -1; //ios终端
  if(isiOS) { // 返回2是ios
    return 2;
  }else{// 返回1是android
    return 1;
  }
}

//判断userAgent
function userAgent(){
  let ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger') {
    return 'weixin';
  } else if(ua.match(/pgy_shurong/i) == 'pgy_shurong') {
    return 'pgy_shurong';
  }else if(ua.match(/QQ/i) == "qq") {
    return 'qq';
  }else{
    return '';
  }
}

// msg提示信息
let flag = true;
function alertMsg(txt) {
  if(flag) {
    flag = false;
    let maskWrap = document.createElement('div');
    let wrap = document.createElement('div');
    maskWrap.className = 'alertMaskWrap';
    wrap.className = 'alertMask';
    wrap.innerText = txt;
    maskWrap.appendChild(wrap);
    document.body.appendChild(maskWrap);
    wrap.className = 'alertMask alertMaskIn';
    setTimeout(function () {
      wrap.className = 'alertMask alertMaskOut';
      setTimeout(function(){
        maskWrap.remove();
      },1500);
      flag = true;
    },1500);
  }
}

// 封装原生ajax
function ajax(method, url, data, callback, flag){
  let xhr = null;
  if(window.XMLHttpRequest){
    xhr = new XMLHttpRequest();
  }else{
    xhr = new ActiveXObject('Microsoft.XMLHttp');
  }
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4){
      if(xhr.status == 200) {
        callback(xhr.responseText);
      }else{
        console.log('error:' + xhr.status);
      }
    }
  }
  method = method.toUpperCase();
  if(method == 'GET') {
    data = data && getParams(data);
    let timer = new Date().getTime();
    xhr.open(method, url + '?' + data + '&timer=' + timer, flag);
    xhr.send();
  }else if(method == 'POST') {
    data = JSON.stringify(data);
    xhr.open(method, url, flag);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhr.send(data);
  }
}

// 封装对象参数为url参数
function getParams(data) {
  let arr = [];
  for (let param in data){
    arr.push(encodeURIComponent(param) + '=' +encodeURIComponent(data[param]));
  }
  return arr.join('&');
}

//下载app
function downloadApp(osFrom) {
  if (osFrom === 1) {//Android
    const iframe = document.createElement('iframe');
    // iframe.src = 'dandelion://shurong.app:8888/openwith';
    iframe.src = window.androidLink;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    // window.location.href(window.androidLink);
  }else if (osFrom === 2){//IOS
    window.location.href = window.iosLink;
  }
}

//获取下载app地址
function downloadUrl(){
  myAxios('/srApis/h5/app/download', 'get', {}, (json) => {
    if(json.code === 200) {
      let data = json.data || {};
      window.androidLink = data.androidLink && data.androidLink.replace(/(^\s*)|(\s*$)/g, "");
      window.iosLink = data.iosLink && data.iosLink.replace(/(^\s*)|(\s*$)/g, "");
    }else{
      alertMsg(json.message);
    }
  });
}
//调用原生方法
function nativeAppFun(str, dataStr, method) {
  let osFrom = getOsFrom();
  let agent = userAgent();
  let jsonStr = JSON.stringify({
    jump: str,
    param: !dataStr ? "" : JSON.stringify(dataStr),
    callBack: method || ""
  });
  if(agent === 'pgy_shurong' && osFrom === 1) {
    android.openNative(jsonStr);
  }else if(agent === 'pgy_shurong' && osFrom === 2){
    window.webkit.messageHandlers.openNative.postMessage(jsonStr);
  }else if(!!dataStr && dataStr.url){//端外
    location.href = dataStr.url;
  }
}

//调用原生方法
function nativeAppFun2(str, dataStr, method) {
  let osFrom = getOsFrom();
  let jsonStr = JSON.stringify({
    method: str,
    params: !dataStr ? "" : JSON.stringify(dataStr),
    callbackfunction: method || ""
  });
  if(osFrom === 1) {
    android.invokeNative(jsonStr);
  }else if(osFrom === 2){
    window.webkit.messageHandlers.invokeNative.postMessage(jsonStr);
  }else if(!!dataStr && dataStr.url){
    location.href = dataStr.url;
  }
}

// 调用原生方法设置标题栏
function titleBar(dataStr) {
  let osFrom = getOsFrom();
  let jsonStr = !dataStr ? "" : JSON.stringify(dataStr);
  if(osFrom === 1) {
    android.dandelionConfigRightItem(jsonStr);
  }else if(osFrom === 2){
    window.webkit.messageHandlers.dandelionConfigRightItem.postMessage(jsonStr);
  }
}

// app分享功能
function appShare(obj, method) {
  let dataObj = {
    'title': obj.shareAppTitle,
    'content': obj.shareAppContent,
    'imageUrl': 'http://letu-test2.oss-cn-hangzhou.aliyuncs.com/test/mirong_logo_new.png',
    'url': obj.linkUrl,
    'pointCode': obj.pointCode,
    'pointSubCode': obj.pointSubCode,
    'downloadImg': obj.downloadImg
  };
  nativeAppFun('SR_Event_Share',dataObj, method);
}

//跳转登录
function linkToLogin() {
  if(!window._dataFromApp.token || window._dataFromApp.dataCode == 2002) {
    nativeAppFun('SR_LoginPage');//跳转登录
    return false;
  }
  return true;
}

// 节流函数
// 触发时立马执行
function throttle(func, wait){
  let lastTime = 0;
  return function(){
    let nowTime = +new Date();
    if(nowTime - lastTime > wait){
      func.apply(this, arguments);
      lastTime = nowTime;
    }
  }
}

//axios封装
function myAxios(url, method, data, callback) {
  axios({
    url: url,
    method: method,
    params: data
  }).then((response) => {
    return response.data;
  }).then((json) => {
    console.log(json);
    if(json.code === '0007'){//token失效
      json.loginInvalid = true;
    }
    callback && callback(json);
  }).catch((e) => {
    console.log(e);
  })
}

//阅读或浏览任务，完成获取积分
function readOrLook(type, contributionId, callback) {
  myAxios('/srApis/h5/integral/gain', 'get', {
    token: window._dataFromApp.token || '',// 登录token
    type: type,
    contributionId: contributionId || ''
  }, (json) => {
    callback(json);
  });
}

//获取系统时间
function getSystemTime() {
  myAxios('/srApis/h5/get/sys/time', 'get', {}, (json) => {
    if(json.code === 200) {
      return data.time || + new Date();
    }else{
      alertMsg(json.message);
      return + new Date();
    }
  });
}

//获取分享下载图
function getShareImg() {
  myAxios('srApp/apis/advertManage/shareImage', 'get', {
    pageType: 3,
    isExamine: window._dataFromApp.isExamine == 1 ? 0 : 1
  }, (json) => {
    if(json.code === 200) {
      let data = json.data || {};
      return data.imageUrl || '';
    }else{
      alertMsg(json.message);
    }
  });
}


export {
  getUrlPara,
  alertMsg,
  getOsFrom,
  userAgent,
  ajax,
  downloadApp,
  appShare,
  linkToLogin,
  nativeAppFun,
  nativeAppFun2,
  titleBar,
  downloadUrl,
  throttle,
  myAxios,
  readOrLook,
  getSystemTime,
  getShareImg
}
