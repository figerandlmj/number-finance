<template>
  <div class="informationDetail" @touchmove="preventTouchmove">
    <div class="topDownloadTip" v-if="!isInApp">
      <div class="left">
        <img src="../../assets/img/logo.png" alt="">
        <p>上数融，发现更多有趣内容</p>
      </div>
      <div class="btn" @click="openApp('top')">打开</div>
    </div>
    <div class="main">
      <div class="title">{{contribution.contribution_title}}</div>
      <div class="fromCollection">
        <div class="from">来自：{{contribution.contribution_source}}</div>
        <div v-if="isShowCollection" class="collection" :class="{ active: isCollection }" @click="collection">{{collectionStatus}}</div>
      </div>
      <div class="card" @click="linkToProduct">
        <img src="http://shurongfile.oss-cn-hangzhou.aliyuncs.com/preEnv/e7f760cb-8e50-46fe-ba43-49cb142f814b.jpg" alt="">
        <div class="word">
          <p class="title">平安易花（急速版）</p>
          <p class="explain">5000额度，极速下款</p>
        </div>
      </div>
      <div class="detail" v-html="contribution.contribution_context">
        <!--<img src="http://letu-test2.oss-cn-hangzhou.aliyuncs.com/test/eeba507e-1649-4d35-af9c-3c3633fb693b.jpg" alt="">-->
        <!--<p></p>-->
      </div>
    </div>
    <div class="bottomTip">已经到底了哦~</div>
    <div class="bottomDownloadTip"  @click="openApp('bottom')">
      <p>上数融，发现更多有趣内容</p>
      <img src="./img/dropDown.png" alt="">
    </div>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
  </div>
</template>

<script>
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { getUrlPara, alertMsg, appShare, linkToLogin, titleBar, userAgent, myAxios, downloadApp, getOsFrom, readOrLook, getShareImg, nativeAppFun } from 'assets/js/utils';

  export default {
    name: 'informationDetail',
    components: {
      vanLoading,
      loginInvalid
    },
    data(){
      return{
        osFrom: getOsFrom(),// 1 android 2 ios
        loginInvalid: false,//登录状态是否失效
        isInApp: userAgent() === 'pgy_shurong',
        contribution_id: getUrlPara('contributionId'),// 资讯页id
        myIntegralType: getUrlPara('myIntegralType'), //阅读资讯 / 浏览产品
        showVanLoading: false,// 是否显示vanLoading
        isShowCollection: false,// 是否显示收藏按钮
        isCollection: false,// 是否收藏
        collectionStatus: '收藏+',//是否收藏文字显示
        contribution: {},// 资讯内容
        imageUrl: '',//分享下载图
        productUrl: '',//产品url
      }
    },
    created(){
      // alertMsg(navigator.userAgent);
      //当前是否在数融app里面
      if(this.isInApp){
        // 设置标题栏
        titleBar({
          itemType: 'share'
        });
        this.isShowCollection = true;
        //阅读任务，完成获取积分
        if(this.myIntegralType === 'read') {
          readOrLook('read', '', (json) => {
            if(json.loginInvalid) {
              this.loginInvalid = true;
            }else{
              alertMsg(json.message);
            }
          });
        }
      }else{
        this.init();
        window.myOnload();
      }
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        //获取分享下载图
        this.imageUrl = getShareImg();
        this.init();
        window.myOnload();
      };
      //app点击分享调用函数
      window.shareInformation = () => {
        //app分享
        appShare({
          linkUrl: location.protocol + '//' + location.host + '/h5/informationDetail.html?contributionId=' + this.contribution_id,
          shareAppTitle: this.contribution.contribution_title,
          shareAppContent: this.contribution.intro,
          pointCode: 'zxxq',
          pointSubCode: 'click_zxxq_fxqd',
          downloadImg: this.imageURL
        }, 'shareBack');
      };
    },
    methods:{
      //跳转产品
      linkToProduct() {
        // 事件埋点
        h5EventBuryingPoints('zxxq', 'click_zxxq_cp', {});
        let url = this.productUrl.indexOf('?') > -1 ? (this.productUrl + "&pageSource=shurongH5") : (this.productUrl + "?pageSource=shurongH5");
        nativeAppFun('SR_H5Page',{
          url: url,//加载url
        });
      },
      preventTouchmove(e){
        !this.isInApp ? e.preventDefault() : "";
      },
      // 初始化页面
      init(){
        this.showVanLoading = true;
        myAxios('/srApis/h5/contribution', 'get', {
          contribution_id: this.contribution_id,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200) {
            let data = json.data;
            this.isCollection = data.is_collection;
            this.contribution = data.contribution;
            if(this.isCollection) {
              this.collectionStatus = '已收藏';
            }else{
              this.collectionStatus = '收藏+';
            }
          }else{
            alertMsg(json.message);
          }
        });
      },
      // 收藏
      collection(){
        //判断是否登录
        if(!linkToLogin()){
          return;
        };
        this.showVanLoading = true;
        // 事件埋点
        h5EventBuryingPoints('zxxq', 'click_zxxq_sc', {
          // mobileNumber: window._dataFromApp.userName,//用户手机号
          isCollection: this.isCollection ? 'cancelMark' : 'pageMark'
        });
        myAxios('/srApis/h5/collection', 'get', {
          contribution_id: this.contribution_id,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200) {
            this.isCollection = !this.isCollection;
            if(this.isCollection) {
              this.collectionStatus = '已收藏';
            }else{
              this.collectionStatus = '收藏+';
            }
          }else{
            alertMsg(json.message);
          }
        });
      },
      // 下载客户端
      openApp(flag){
        if(flag === 'top') {
          // 事件埋点
          h5EventBuryingPoints('zxxq', 'click_zxxq_banner', {});
        }else if(flag === 'bottom') {
          // 事件埋点
          h5EventBuryingPoints('zxxq', 'click_zxxq_dbwn', {});
        }
        downloadApp(this.osFrom);
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  body{
    background: #F2F2F2;
  }
  .main{
    background: #fff;
    padding: vw(24);
  }
  .title{
    line-height: vw(56);
    font-size: vw(40);
    color: #333;
    font-weight: bold;
  }
  .fromCollection{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: vw(20) 0;
    font-size: vw(24);
    color: #999;
    border-bottom: 1px solid #F2F2F2;
    .collection{
      width: vw(110);
      height: vw(52);
      text-align: center;
      line-height: vw(52);
      border-radius: vw(26);
      color: #fff;
      border: 1px solid #FF6F6F;
      background: #FF6F6F;
      &.active{
        color: #999;
        border: 1px solid #E1E1E1;
        background: #fff;
      }
    }
  }
  .detail{
    margin: vw(30) 0;
    img{
      width: 100%;
    }
  }
  .bottomTip{
    margin: vw(32) 0;
    font-size: vw(28);
    color: #9F9F9F;
    text-align: center;
  }
  .card{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: vw(20) auto;
    padding: vw(20) 0;
    background: url("./img/cardBg.png") no-repeat center;
    background-size: vw(704) vw(184);
    box-sizing: border-box;
    img{
      width: vw(112);
      height: vw(112);
      margin-right: vw(24);
      border-radius: vw(10);
      margin-left: vw(32);
    }
    .word{
      flex: 1;
      margin-right: vw(32);
    }
    .title{
      font-size: vw(36);
      color: #333;
      font-weight: 500;
    }
    .explain{
      margin-top: vw(14);
      font-size: vw(30);
      color: #333;
    }
  }
  .topDownloadTip{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0,0,0,.498);
    padding: vw(22) vw(24);
    .left{
      display: flex;
      align-items: center;
    }
    img{
      width: vw(80);
      height: vw(80);
      margin-right: vw(14);
    }
    p{
      font-size: vw(30);
      color: #fff;
      font-weight: 500;
    }
    .btn{
      width: vw(138);
      height: vw(60);
      line-height: vw(60);
      border-radius: vw(30);
      text-align: center;
      font-size: vw(28);
      color: #333;
      background: #FFD93B;
      opacity: 1;
    }
  }
  .bottomDownloadTip{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: vw(210);
    background: linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);
    p{
      margin-top: vw(102);
      font-size: vw(32);
      text-align: center;
      color: #3561FF;
    }
    img{
      position: absolute;
      bottom: vw(18);
      left: 0;
      right: 0;
      width: vw(18);
      height: vw(20);
      margin: auto;
      animation: move 500ms infinite alternate ease-in;

    }
    @keyframes move {
      0% {bottom: vw(18);}
      100% {bottom: vw(34);}
    }
  }
</style>
