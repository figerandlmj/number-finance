<template>
  <div class="makeMoney">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 下拉刷新图片-->
      <div class="refreshImg" slot="pulling"><img src="../../assets/img/pullRefresh/refresh.png"/></div>
      <div class="refreshImg" slot="loading"><img src="../../assets/img/pullRefresh/refresh.gif"/></div>
      <div class="refreshImg" slot="loosing"><img src="../../assets/img/pullRefresh/refresh.png"/></div>
      <div class="top">
        <img src="./img/bg.png" alt="">
        <div class="integralNumber">
          <div class="integral">当前积分:<span>{{curIntegral}}</span></div>
          <div class="number">
            <span>我的数融家族</span>
            <span class="line"></span>
            <img src="./img/avatar1.png" alt="" v-if="number >= 1">
            <img src="./img/avatar2.png" alt="" v-if="number >= 2">
            <img src="./img/avatar3.png" alt="" v-if="number >= 3">
            <img src="./img/avatar4.png" alt="" v-if="number >= 4">
            <span v-if="number >= 5">&nbsp;等<label>{{number}}</label>人</span>
            <span v-else>&nbsp;<label>{{number}}</label>人</span>
          </div>
        </div>
      </div>
      <div class="mainWrap">
        <div class="inviteFriends">
          <div class="titleWrap">
            <span class="title">我的招新任务</span>
            <span class="ruleBtn" @click="linkToRuleActivity">活动规则</span>
          </div>
          <div class="invitation">
            <img src="./img/invitation.png" alt="">
            <div class="right">
              <p class="p1">邀请好友注册</p>
              <p class="p2">绑定一个新成员立得<span>{{addIntegral}}积分</span></p>
              <input type="button" value="开始" @click="share">
            </div>
          </div>
          <ul>
            <li><span></span>发送专属邀请函，好友完成注册并登陆，即可获得积分，单日可累计参与{{joinNumber}}次。</li>
            <!--<li><span></span>新用户登录客户端，1积分即刻到账</li>-->
          </ul>
        </div>
        <div class="integralWrap">
          <div class="title">积分兑换</div>
          <ul>
            <!--<li>-->
              <!--<div class="img">-->
                <!--<img src="./img/balance.png" alt="">-->
              <!--</div>-->
              <!--<div class="detail">-->
                <!--<p class="p1">积分兑换为账户余额</p>-->
                <!--<p class="p2">支持提现</p>-->
              <!--</div>-->
              <!--<input type="button" value="立即兑换" @click="exchangeBalance">-->
            <!--</li>-->
            <li v-for="(item, index) in exchangeList" :key="index">
              <div class="img">
                <img :src="item.image_url + ''" @error="imgError(item, 'middle.jpg')" alt="">
              </div>
              <div class="detail">
                <p class="p1">{{item.name}}</p>
                <p class="p2">{{item.illustrate}}</p>
                <!--<p class="p3">满{{item.integral}}积分</p>-->
              </div>
              <div class="right">
                <p>
                  <img src="./img/integralIcon.png" alt="">
                  <span>{{item.integral}}积分</span>
                </p>
                <input type="button" value="立即兑换" @click="exchangeProduct(item.id, item.integral, item.name)">
              </div>
            </li>
          </ul>
        </div>
      </div>
    </van-pull-refresh>
    <!-- 积分兑换余额弹框 -->
    <div class="mask" @touchmove.prevent v-show="box['balanceExchange']">
      <div class="box balanceBox">
        <div class="close">
          <img src="../../assets/img/close2.png" alt="" @click="closeMask('balanceExchange')">
        </div>
        <input type="number" placeholder="请输入兑换的积分数量" class="input" v-model="inputIntegral">
        <p>* 积分与人民币比例为1:1</p>
        <div class="btn" @click="confirmBalance">确定</div>
      </div>
    </div>
    <!-- 积分兑换商品弹框 -->
    <product-box v-show="box['productExchange']" :curIntegral="curIntegral" :exchangeId="exchangeId" :exchangeName="exchangeName" @closeMask="closeMask" @isShowVanLoading="isShowVanLoading" @isLoginInvalid="isLoginInvalid"></product-box>
    <!-- 用户违规进入黑名单弹框 -->
    <black-list-box v-show="box['violation']" @closeMask="closeMask"></black-list-box>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
  </div>
</template>

<script>
  import { PullRefresh } from 'vant';// 下拉刷新
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import blackListBox from 'components/blackListBox/index';//用户违规进入黑名单弹框
  import productBox from 'components/productBox/index';//积分兑换商品弹框
  import { myAxios, alertMsg, appShare, linkToLogin, userAgent, nativeAppFun, getShareImg } from 'assets/js/utils';

  export default {
    name: 'makeMoney',
    components: {
      vanPullRefresh: PullRefresh,
      vanLoading,
      loginInvalid,
      blackListBox,
      productBox
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        isLoading: false,// 是否在加载中
        showVanLoading: false,// 是否显示vanLoading
        // 是否显示积分兑换弹窗
        box: {
          'productExchange': false,
          'balanceExchange': false,
          'violation': false,
        },
        inputIntegral: '',//输入的兑换积分数量
        curIntegral: 0,// 当前积分
        addIntegral: 0,// 绑定一个成员所得积分
        number: 0,// 数融家族人数
        exchangeList: [],// 积分兑换列表
        exchangeId: 0,// 兑换商品id
        exchangeName: '',// 兑换商品名称
        joinNumber: 'N',//单日可累计参与次数
        isBlackList: false,//是否在黑名单中
        imageUrl: '',//分享下载图
      }
    },
    created(){
      //当前是否在数融app里面
      if(userAgent() !== 'pgy_shurong') {
        this.init();
        window.myOnload();
      }
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        //获取分享下载图
        this.imageUrl = getShareImg();
        this.init();
        window.myOnload();
      };
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    methods:{
      isShowVanLoading(flag){// 是否显示vanLoading
        this.showVanLoading = flag;
      },
      isLoginInvalid(flag){// 是否显示loginInvalid
        this.loginInvalid = flag;
      },
      closeMask(flag) {
        this.box[flag] = false;
      },
      imgError(item, imgName) {//图片加载失败显示默认图
        item.image_url = require('../../assets/img/'+ imgName);
      },
      //跳转活动规则
      linkToRuleActivity() {
        nativeAppFun('SR_H5Page',{
          url: location.protocol + '//' + location.host + '/h5/ruleActivity.html'
        });
      },
      onRefresh(){// 下拉刷新时触发
        let href = location.href;
        window.location.href = href.indexOf('?') > 0 ? href + "&timeStamp=" + (+new Date()) : href + "?timeStamp=" + (+new Date());
      },
      //积分兑换商品（立即兑换）
      exchangeProduct(id, integral, name){
        //判断是否登录
        if(!linkToLogin()){
          return;
        }
        if(this.isBlackList) {
          this.box['violation'] = true;
          return;
        }
        if(integral > this.curIntegral) {
          alertMsg('您的积分不足，还需再接再厉');
          return;
        }
        this.exchangeId = id;
        this.exchangeName = name;
        this.box['productExchange'] = true;
      },
      //积分兑换余额（立即兑换）
      exchangeBalance() {
        if(this.isBlackList) {
          this.box['violation'] = true;
          return;
        }
        // 事件埋点
        h5EventBuryingPoints('zq', 'click_zq_dhye', {});
        //判断是否登录
        if(!linkToLogin()){
          return;
        }
        if(this.curIntegral > 0) {
          this.box['balanceExchange'] = true;
        }else {
          alertMsg('您的积分不足，还需再接再厉');
        }
      },
      //积分兑换余额（确认兑换）
      confirmBalance() {
        if(this.inputIntegral > 0 && this.inputIntegral <= this.curIntegral) {
          this.integralExchangeBalance();
        }else {
          alertMsg('输入积分有误，请重新输入');
        }
      },
      // 分享h5邀请页
      share() {
        //判断是否登录
        if(userAgent() === 'pgy_shurong' && !linkToLogin()){
          return;
        }
        if(this.isBlackList) {
          this.box['violation'] = true;
          return;
        }
        // 事件埋点
        h5EventBuryingPoints('zq', 'click_zq_ks', {
          // pageTitle: 'H5赚钱页'
        });
        //app分享
        appShare({
          linkUrl: location.protocol + '//' + location.host + '/h5/requestRegister.html?yqNumber=' + (window._dataFromApp.userPhone || '') + '&yqUserId=' + (window._dataFromApp.userId || ''),
          shareAppTitle: '您的好友邀请您成为数融家人',
          shareAppContent: '我们的关键词是超低门槛，聚合多家平台资源',
          pointCode: 'zq',
          pointSubCode: 'click_zq_fxqd',
          downloadImg: this.imageURL
        }, 'shareBack');
      },
      // 页面初始化
      init(){
        myAxios('/srApis/h5/makeMoney', 'get', {
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.isLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data;
            let userInfo = !data.userInfo ? {} : data.userInfo;
            this.curIntegral = userInfo.current_integral || 0;
            this.number = userInfo.recommend_number || 0;
            this.addIntegral = data.integral;
            this.exchangeList = data.integralProducts;
            this.joinNumber = data.exchangeTimes || 'N';
            this.isBlackList = data.isBlack || false;
            this.isBlackList ? this.box['violation'] = true : this.box['violation'] = false;
          }else{
            alertMsg(json.message);
          }
        });
      },
      // 积分兑换余额
      integralExchangeBalance(){
        this.showVanLoading = true;
        myAxios('/srApis/apis/integral/exchange', 'post', {
          token: window._dataFromApp.token || '',// 登录token
          integralCount: this.inputIntegral,
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200) {
            alertMsg('兑换成功，可在<我的余额>中提现');
            this.box['balanceExchange'] = false;
            setTimeout(function(){
              location.reload();
            },1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
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
  /* 下拉刷新图片 */
  .van-pull-refresh{
    overflow: initial;
  }
  .refreshImg {
    background: #f7f7f7;
    img {
      display: inline-block;
      width: 30px;
      margin: 0 auto;
    }
  }
  .makeMoney{
    position: relative;
  }
  .top{
    img{
      width: 100%;
    }
    .integralNumber{
      position: absolute;
      top: vw(15);
      left: 0;
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: vw(24);
      color: #1A1600;
    }
    .integral{
      height: vw(58);
      padding: 0 vw(18);
      line-height: vw(58);
      text-align: center;
      background: rgba(255,255,255,.4);
      border-radius: 0 vw(29) vw(29) 0;
      span{
        color: #fc6e59;
      }
    }
    .number{
      display: flex;
      align-items: center;
      height: vw(58);
      padding: 0 vw(18);
      line-height: vw(58);
      text-align: center;
      background: rgba(255,255,255,.4);
      border-radius: vw(29) 0 0 vw(29);
      .line{
        display: inline-block;
        width: 1px;
        height: vw(24);
        margin: 0 vw(14);
        background: #FED211;
      }
      img{
        display: inline-block;
        width: vw(40);
        height: vw(40);
      }
      label{
        color: #fc6e59;
      }
    }
  }
  .mainWrap{
    position: absolute;
    top: vw(135);
    left: 0;
    right: 0;
    width: 90%;
    margin: auto;
    margin-bottom: vw(25);
    > div{
      padding: vw(30) 0;
      border-radius: vw(20);
      background: #fff;
    }
    .titleWrap{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 vw(30) vw(30);
      border-bottom: 1px solid #f2f2f2;
      .title{
        font-size: vw(28);
        color: rgb(140,140,140);
      }
      .ruleBtn{
        font-size: vw(26);
        color: #2C8CF1;
      }
    }
  }
  .inviteFriends{
    .invitation{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: vw(38) vw(30) vw(20);
      img{
        width: vw(282);
        height: vw(225);
      }
    }
    .right{
      text-align: center;
      .p1{
        font-size: vw(50);
        color:rgb(19,16,0);
      }
      .p2{
        margin: vw(20) 0 vw(28);
        font-size: vw(22);
        color:rgb(178,178,178);
        span{
          color: #fc6e59;
        }
      }
      input{
        width: vw(250);
        height: vw(60);
        border-radius: vw(30);
        font-size: vw(28);
        color:rgb(19,16,0);
        background: rgb(254,209,18);
      }
    }
    ul{
      padding: 0 vw(30);
      li{
        display: flex;
        align-items: center;
        &:nth-of-type(n+2){
          margin-top: vw(10);
        }
        font-size: vw(18);
        color: rgb(184,183,183);
        span{
          display: inline-block;
          width: vw(6);
          height: vw(6);
          margin-right: vw(6);
          background: #FDDB09;
          border-radius: 50%;
        }
      }
    }
  }
  .integralWrap{
    margin-top: vw(25);
    .title{
      padding: 0 vw(30);
      font-size: vw(32);
      color: #333;
    }
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: vw(24) vw(30);
      &:nth-of-type(n+2){
        border-top: vw(1) solid #f2f2f2;
      }
      .detail{
        flex: 1;
        margin-left: vw(20);
      }
      .img{
        img{
          width: vw(156);
        }
      }
      .p1{
        font-size: vw(30);
        color:rgb(19,16,0);
      }
      .p2{
        margin-top: vw(6);
        margin-bottom: vw(10);
        font-size: vw(22);
        color:rgb(126,126,126);
      }
      .p3{
        font-size: vw(20);
        color:rgb(251,65,69);
      }
      .right{
        display: flex;
        flex-direction: column;
        align-items: center;
        p{
          display: flex;
          align-items: center;
          text-align: center;
        }
        img{
          display: inline-block;
          width: vw(22);
          height: vw(22);
          margin-right: vw(6);
        }
        span{
          font-size: vw(20);
          color: #FB4145;
        }
      }
      input{
        width: vw(160);
        height: vw(50);
        margin-top: vw(16);
        border-radius: vw(25);
        font-size: vw(24);
        color:rgb(19,16,0);
        background: rgb(254,209,18);
      }
    }
  }
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    .box{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%,-50%,0);
      width: 85%;
      text-align: center;
      background: #fff;
      border-radius: vw(10);
    }
    .balanceBox{
      padding: vw(28) vw(30) vw(36);
      .btn{
        width: vw(420);
        height: vw(70);
        line-height: vw(70);
        margin: vw(44) auto 0;
        font-size: vw(30);
        color: #333;
        text-align: center;
        border-radius: vw(35);
        background: #FFD93B;
      }
      .close{
        img{
          float: right;
          width: vw(30);
          height: vw(28);
        }
        &::after{
          content: '';
          display: block;
          clear: both;
        }
      }
      .input{
        box-sizing: border-box;
        width: 100%;
        height: vw(80);
        padding: vw(20);
        margin-top: vw(32);
        font-size: vw(28);
        color: #333;
        background: rgba(243,243,243,1);
        border-radius: 3px;
      }
      p{
        margin-top: vw(22);
        font-size: vw(24);
        color: #888;
        text-align: left;
      }
    }
  }
</style>
