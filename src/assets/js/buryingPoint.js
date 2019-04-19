import { getUrlPara, ajax, alertMsg, nativeAppFun } from './utils.js';

let h5BuryingPointUrl = 'http://tpvuv.lechuangtec.com';//埋点域名
// let h5BuryingPointUrl = 'http://gpvuv.lechuangtec.com';//预发埋点域名
// let h5BuryingPointUrl = 'http://ppvuv.lechuangtec.com';//线上埋点域名

// 页面埋点数据
let page = {
  sr_ym_mk: 'loanMarket.html',
  sr_ym_mk2: 'loanMarket2.html',
  sr_ym_yq: 'requestRegister.html',
  sr_ym_yqcg: 'requestResult.html',
  sr_ym_qdzc: 'registerChannel.html',
  sr_ym_qdzccg: 'registerResult.html',
  sr_ym_zq: 'makeMoney.html',
  sr_ym_zxxq: 'informationDetail.html',
  sr_ym_yswd: 'my/myIndex.html',
  sr_ym_wdyhk: 'my/bankCard.html',
  sr_ym_tjyhk: 'my/bankCardBind.html',
  sr_ym_wdsq: 'my/myApply.html',
  sr_ym_zhye: 'my/cashWithdrawal.html',
  sr_ym_jf: 'my/myIntegral.html',
};

let href = location.href;// 页面url
let code = getUrlPara('code');//贷超页面编码
let dcqdCode = getUrlPara('channel');//贷超渠道编码
let yqUserId = getUrlPara('yqUserId');//邀请人用户id

// h5事件埋点
window.h5EventBuryingPoints = function (pointCode, pointSubCode, obj) {
  obj.applyTime = + new Date();//操作时间
  let pointInfo = Object.assign({}, obj, window._dataFromApp);// 合并obj和window._dataFromApp数据
  let data = {
    pointCode: pointCode,// 埋点编码
    pointSubCode: pointSubCode,//	埋点子编码
    pointInfo: encodeURIComponent(JSON.stringify(pointInfo))//	app信息json字符串
  };
  axios({
    url: h5BuryingPointUrl + '/point/add',
    method: 'post',
    data: data
  }).then((response) => {
    return response.data
  }).then((json) => {
    console.log(json);
  }).catch((e) => {
    console.log(e);
  });
}

// h5页面埋点
window.h5PageBuryingPoints = function (pointCode, fromPointCode, intoTime, outTime, obj) {
  obj = obj || {};
  let appInfo = Object.assign({}, window._dataFromApp, obj);
  let data = {
    "accessCode":'1002',//渠道来源code 不变
    "pointCode": pointCode,//	页面埋点编码
    "fromPointCode": fromPointCode,//页面埋点来源 不变
    "into_time": intoTime ? (+ new Date()) : '',// 进入时间
    "out_time": outTime ? (+ new Date()) : '',// 出来时间
    "appInfo": encodeURIComponent(JSON.stringify(appInfo))
  };
  let url = h5BuryingPointUrl + '/srPagePoint/add';
  if(outTime) {
    ajax('post', url, data, function(json){
      console.log(json);
    }, false);
  }else{
    axios({
      url: url,
      method: 'post',
      data: data
    }).then((response) => {
      return response.data
    }).then((json) => {
      console.log(json);
    }).catch((e) => {
      console.log(e);
    });
  }
}

//  页面进入埋点
window.myOnload = function() {
  console.log('onload');
  if(href.indexOf(page.sr_ym_mk) > -1 || href.indexOf(page.sr_ym_mk2) > -1) {
    h5PageBuryingPoints('sr_ym_mk', '',  1, '', {
      dcqdCode: dcqdCode,
      code: code
    });
  }else if(href.indexOf(page.sr_ym_yq) > -1) {
    h5PageBuryingPoints('sr_ym_yq', '', 1, '', {
      yqUserId: yqUserId
    });
  }else if(href.indexOf(page.sr_ym_yqcg) > -1) {
    h5PageBuryingPoints('sr_ym_yqcg', 'sr_ym_yq', 1, '', {
      yqUserId: yqUserId
    });
  }else if(href.indexOf(page.sr_ym_qdzc) > -1) {
    h5PageBuryingPoints('sr_ym_qdzc', '', 1, '', {
      dcqdCode: dcqdCode
    });
  }else if(href.indexOf(page.sr_ym_qdzccg) > -1) {
    h5PageBuryingPoints('sr_ym_qdzccg', 'sr_ym_qdzc', 1, '', {
      dcqdCode: dcqdCode
    });
  }else if(href.indexOf(page.sr_ym_zq) > -1) {
    h5PageBuryingPoints('sr_ym_zq', '', 1, '');
  }else if(href.indexOf(page.sr_ym_zxxq) > -1) {
    let contributionId = getUrlPara('contributionId');// 资讯页id
    h5PageBuryingPoints('sr_ym_zxxq', '', 1, '', {
      contributionId: contributionId
    });
  }else if(href.indexOf(page.sr_ym_yswd) > -1) {
    h5PageBuryingPoints('sr_ym_yswd', '', 1, '');
  }else if(href.indexOf(page.sr_ym_wdyhk) > -1) {
    h5PageBuryingPoints('sr_ym_wdyhk', '', 1, '');
  }else if(href.indexOf(page.sr_ym_tjyhk) > -1) {
    h5PageBuryingPoints('sr_ym_tjyhk', '', 1, '');
  }else if(href.indexOf(page.sr_ym_wdsq) > -1) {
    h5PageBuryingPoints('sr_ym_wdsq', '', 1, '');
  }else if(href.indexOf(page.sr_ym_zhye) > -1) {
    h5PageBuryingPoints('sr_ym_zhye', '', 1, '');
  }else if(href.indexOf(page.sr_ym_jf) > -1) {
    h5PageBuryingPoints('sr_ym_jf', '', 1, '');
  }
};

//  页面离开埋点
window.onbeforeunload = function() {
  console.log('onbeforeunload');
  if(href.indexOf(page.sr_ym_mk) > -1 || href.indexOf(page.sr_ym_mk2) > -1) {
    h5PageBuryingPoints('sr_ym_mk', '', '', 1, {
      dcqdCode: dcqdCode,
      code: code
    });
  }else if(href.indexOf(page.sr_ym_yq) > -1) {
    h5PageBuryingPoints('sr_ym_yq', '', '', 1, {
      yqUserId: yqUserId
    });
  }else if(href.indexOf(page.sr_ym_yqcg) > -1) {
    h5PageBuryingPoints('sr_ym_yqcg', 'sr_ym_yq', '', 1, {
      yqUserId: yqUserId
    });
  }else if(href.indexOf(page.sr_ym_qdzc) > -1) {
    h5PageBuryingPoints('sr_ym_qdzc', '', '', 1, {
      dcqdCode: dcqdCode
    });
  }else if(href.indexOf(page.sr_ym_qdzccg) > -1) {
    h5PageBuryingPoints('sr_ym_qdzccg', 'sr_ym_qdzc', '', 1, {
      dcqdCode: dcqdCode
    });
  }else if(href.indexOf(page.sr_ym_zq) > -1) {
    h5PageBuryingPoints('sr_ym_zq', '', '', 1);
  }else if(href.indexOf(page.sr_ym_zxxq) > -1) {
    let contributionId = getUrlPara('contributionId');// 资讯页id
    h5PageBuryingPoints('sr_ym_zxxq', '', '', 1, {
      contributionId: contributionId
    });
  }else if(href.indexOf(page.sr_ym_yswd) > -1) {
    h5PageBuryingPoints('sr_ym_yswd', '', '', 1);
  }else if(href.indexOf(page.sr_ym_wdyhk) > -1) {
    h5PageBuryingPoints('sr_ym_wdyhk', '', '', 1);
  }else if(href.indexOf(page.sr_ym_tjyhk) > -1) {
    h5PageBuryingPoints('sr_ym_tjyhk', '', '', 1);
  }else if(href.indexOf(page.sr_ym_wdsq) > -1) {
    h5PageBuryingPoints('sr_ym_wdsq', '', '', 1);
  }else if(href.indexOf(page.sr_ym_zhye) > -1) {
    h5PageBuryingPoints('sr_ym_zhye', '', '', 1);
  }else if(href.indexOf(page.sr_ym_jf) > -1) {
    h5PageBuryingPoints('sr_ym_jf', '', '', 1);
  }
};

// 获取从原生App传过来的数据
window._dataFromApp = {};
window.getConfigFromApp = function(originObj) {
  // alertMsg(JSON.stringify(originObj));
  if(typeof(originObj) === 'string'){
    window._dataFromApp = !originObj ? {} : JSON.parse(originObj);
  }else{
    window._dataFromApp = !originObj ? {} : originObj;
  }
  window.getConfigFromAppCallback();
}

//获取从原生App传过来的数据之后的回调
window.getConfigFromAppCallback = () => {
  window.myOnload();
};

// getConfigFromApp(JSON.stringify({
//   token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxODU1NzUxMzI4OCwxNTQ1NjM0OTk2MDU3In0.Se36SWhxT4b3VDNKurNT4yls7eYecjqBzeWFAT-GeyXmXZldIc6JFU5aAh47K34sU0L8zcVmlL2Xkc54Y47zOw',// 登录token
// }));

// 原生返回按钮点击事件
window.appBackEvent = function () {
  window.onbeforeunload();
  let callback = "";
  nativeAppFun('SR_Event_Back', "", callback);//返回
}

//返回进入页面后刷新页面的回调
window.callBackFresh = function() {
  window.getConfigFromAppCallback();
}

//  分享成功后的回调
window.shareBack = function(objStr) {
  let obj = {};
  if(typeof(objStr) === 'string'){
    obj = !objStr ? {} : JSON.parse(objStr);
  }else{
    obj = !objStr ? {} : objStr;
  }
  if(obj.flag){
    alertMsg('分享成功');
  }else{
    alertMsg('分享失败，请重试');
  }
}
