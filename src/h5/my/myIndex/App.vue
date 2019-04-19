<template>
  <div class="myIndex">
    <div class="userWrap">
      <img src="./img/topBg.png" alt="" class="topBg">
      <div class="wrap">
        <img :src="avatar" alt="" class="avatar">
        <span v-if="isLogin">{{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
        <span v-else @click="toLogin">点击登录</span>
      </div>
    </div>
    <div class="cashWrap" v-if="isLogin">
      <div class="title">
        <img src="./img/icon1.png" alt="" class="icon">
        <span>账户余额(元）</span>
      </div>
      <div class="cash">
        <span class="span1">{{cash.toFixed(2)}}</span>
        <span class="span2" @click="linkToPage('SR_H5Page', 'my/cashWithdrawal', 'click_yswd_zhye')">提现</span>
      </div>
    </div>
    <ul class="liWrap">
      <li @click="linkToPage('SR_H5Page', 'my/myIntegral', 'click_yswd_wdjf')">
        <div class="left">
          <img src="./img/icon8.png" alt="" class="icon">
          <span>我的积分</span>
        </div>
        <div class="right">
          <span>兑换商品</span>
          <img src="./img/arrowRight.png" alt="" class="arrowRight">
        </div>
      </li>
    </ul>
    <ul class="liWrap">
      <li v-if="isShowMyApply" @click="linkToPage('SR_H5Page', 'my/myApply', 'click_yswd_wdsq')">
        <div class="left">
          <img src="./img/icon2.png" alt="" class="icon">
          <span>我的申请</span>
        </div>
        <img src="./img/arrowRight.png" alt="" class="arrowRight">
      </li>
      <li @click="linkToPage('SR_H5Page', 'my/bankCard', 'click_yswd_wdyhk')">
        <div class="left">
          <img src="./img/icon3.png" alt="" class="icon">
          <span>银行卡</span>
        </div>
        <img src="./img/arrowRight.png" alt="" class="arrowRight">
      </li>
      <li @click="linkToPage('SR_H5Page', 'accountingAssistant/index', 'click_yswd_jz')">
        <div class="left">
          <img src="./img/icon10.png" alt="" class="icon">
          <span>记账助手</span>
        </div>
        <img src="./img/arrowRight.png" alt="" class="arrowRight">
      </li>
    </ul>
    <ul class="liWrap">
      <li @click="linkToPage('SR_CollectionPage', '', 'click_yswd_sc')">
        <div class="left">
          <img src="./img/icon4.png" alt="" class="icon">
          <span>我的收藏</span>
        </div>
        <img src="./img/arrowRight.png" alt="" class="arrowRight">
      </li>
      <li @click="linkToPage('SR_MessageCenter', '', 'click_yswd_xxzx')">
        <div class="left">
          <img src="./img/icon5.png" alt="" class="icon">
          <span>消息中心</span>
        </div>
        <img src="./img/arrowRight.png" alt="" class="arrowRight">
      </li>
      <li @click="linkToPage('SR_Feedback', '', 'click_yswd_yjfk')">
        <div class="left">
          <img src="./img/icon6.png" alt="" class="icon">
          <span>意见反馈</span>
        </div>
        <img src="./img/arrowRight.png" alt="" class="arrowRight">
      </li>
      <li @click="linkToPage('SR_H5Page', 'onlineService', 'click_yswd_zxkf')">
        <div class="left">
          <img src="./img/icon9.png" alt="" class="icon">
          <span>在线客服</span>
        </div>
        <img src="./img/arrowRight.png" alt="" class="arrowRight">
      </li>
      <li @click="linkToPage('SR_Setting', '', 'click_yswd_sz')">
        <div class="left">
          <img src="./img/icon7.png" alt="" class="icon">
          <span>设置</span>
        </div>
        <img src="./img/arrowRight.png" alt="" class="arrowRight">
      </li>
      <!--<li @click="linkToPage('SR_VersionManagement', '', 'click_yswd_bbgl')">-->
        <!--<div class="left">-->
          <!--<img src="./img/icon7.png" alt="" class="icon">-->
          <!--<span>版本管理</span>-->
        <!--</div>-->
        <!--<img src="./img/arrowRight.png" alt="" class="arrowRight">-->
      <!--</li>-->
    </ul>
    <!--<div class="signOutWrap">-->
      <!--<div class="signOut" v-if="isLogin" @click="signOut">退出登录</div>-->
    <!--</div>-->
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { alertMsg, linkToLogin, userAgent, nativeAppFun, myAxios } from 'assets/js/utils';
  export default {
    name: 'myIndex',
    components: {
      vanLoading,
      loginInvalid
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        isLogin: true,//是否登录
        phone: '',//用户手机号
        cash: 0,//账户余额
        cardNo: '',//卡号
        avatar: require('assets/img/avatar.png'),//头像
        isShowMyApply: false,//是否显示我的申请
        isUpperLimit: false,//提现次数是否达上限
      }
    },
    created(){
      //退出登录回调函数
      window.logoutBack = (param) => {
        if(param === '1') {
          this.isLogin = false;
          this.avatar = require('assets/img/avatar.png');
        }
      }
      this.init();
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        this.init();
        if(!window._dataFromApp.token) {
          this.isLogin = false;
          this.avatar = require('assets/img/avatar.png');
        }
        window.myOnload();
      };
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    beforeDestroy(){
    },
    methods:{
      //页面初始化
      init() {
        myAxios('/srApis/apis/remainingSum/getRemainingSum', 'post', {
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data;
            this.phone = data.name;
            this.cash = data.remainingSum || 0;
            this.isLogin = true;
            this.cardNo = data.cardNo;
            if(data.headImg) {
              this.avatar = data.headImg;
            }
            this.isShowMyApply = data.isShow || false;
            this.isUpperLimit = data.isLimite;
          }else if(json.code != 202){
            alertMsg(json.message);
          }
        });
      },
      //登录
      toLogin() {
        linkToLogin();
      },
      //点击页面跳转
      linkToPage(str, page, point) {
        // 事件埋点
        h5EventBuryingPoints('yswd', point, {});
        // if(linkToLogin()) {
          let callback = "";
          // 在线客服
          if(page === 'onlineService') {
            NTKF.im_openInPageChat('kf_10166_1521081322742');
            return;
          }
          // 余额提现
          if(page === 'cashWithdrawal' && !this.cardNo) {//提现没有绑卡跳转绑卡页面
            alertMsg('请先绑卡');
            setTimeout(() => {
              nativeAppFun('SR_H5Page',{
                url: location.protocol + '//' + location.host + '/h5/my/bankCardBind.html?pageSource=shurongH5',//加载url
              }, callback);
            }, 1500);
            return;
          }
          if(page === 'cashWithdrawal' && this.isUpperLimit) {
            alertMsg('今日提现次数已达到上限');
            return;
          }
          if(!!page) {
            let url = location.protocol + '//' + location.host + '/h5/' + page + '.html?pageSource=shurongH5';
            nativeAppFun(str,{
              url: url,//加载url
            }, callback);
          }else{
            nativeAppFun(str, "", callback);
          }
        // }
      },
      //退出登录
      // signOut() {
      //   // 事件埋点
      //   h5EventBuryingPoints('yswd', 'click_yswd_tcdl', {});
      //   nativeAppFun('SR_Logout', {}, 'logoutBack');
      // },
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  body{
    background: #f7f7f7;
  }
  .myIndex{
    .userWrap{
      position: relative;
      height: vw(270);
      padding: vw(80) 0;
      background: #fff;
      .topBg{
        position: absolute;
        top: 0;
        right: 0;
        width: vw(414);
        height: vw(250);
      }
      .wrap{
        position: absolute;
        top: vw(80);
        left: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        height: vw(120);
        padding: 0 vw(24);
        font-size: vw(46);
        color: #333;
      }
      .avatar{
        width: vw(152);
        height: vw(152);
        margin-right: vw(10);
        border-radius: 50%;
      }
    }
    .icon{
      width: vw(40);
      height: vw(40);
    }
    .cashWrap{
      padding: 0 vw(24) vw(18);
      background: #fff;
      .title{
        display: flex;
        align-items: center;
        font-size: vw(28);
        color: #333;
        img{
          margin-right: vw(10);
        }
      }
      .cash{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: vw(22);
        .span1{
          font-size: vw(64);
          color: #333;
        }
        .span2{
          width: vw(160);
          height: vw(56);
          line-height: vw(56);
          font-size: vw(28);
          color: #FF5500;
          text-align: center;
          border-radius: vw(30);
          border: 1px solid #FF5500;
        }
      }
    }
    .liWrap{
      margin-top: vw(16);
      background: #fff;
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: vw(24);
        padding: vw(30) vw(24) vw(30) 0;
        &:nth-of-type(n+2){
          border-top: 1px solid #F3F3F3;
        }
      }
      .left{
        display: flex;
        align-items: center;
        font-size: vw(28);
        color: #333;
      }
      .right{
        display: flex;
        align-items: center;
        span{
          margin-right: vw(20);
          font-size: vw(24);
          color: #FF4040;
        }
      }
      .icon{
        margin-right: vw(16);
      }
      .arrowRight{
        width: vw(10);
        height: vw(16);
      }
    }
    .signOutWrap{
      display: flex;
      align-items: center;
      padding-bottom: vw(126);
      .signOut{
        width: vw(400);
        height: vw(88);
        margin: vw(126) auto 0;
        font-size: vw(36);
        color: #999;
        line-height: vw(88);
        text-align: center;
        border-radius: vw(200);
        border: 2px solid rgba(225,225,225,1);
      }
    }
  }

</style>
