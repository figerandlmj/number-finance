<template>
  <div class="myIntegral">
    <div class="top">
      <p class="p1">{{integral}}分</p>
      <p class="p2" @clcik="linkToIntegralDetail">
        <span>积分明细</span>
        <img src="./img/arrowIcon.png" alt="">
      </p>
    </div>
    <div class="part1">
      <div class="title">做任务，赚积分</div>
      <ul>
        <li v-for="(item, index) in integralRule" :key="index">
          <div class="left">
            <img :src="item.iconUrl" alt="" class="icon">
            <div class="name">
              <p class="p1">{{item.ruleName}}</p>
              <p class="p2">
                <img src="./img/integralIcon.png" alt="" class="integralIcon">
                <span>+{{item.integral}}</span>
              </p>
            </div>
          </div>
          <div class="right">
            <!-- 签到 -->
            <template v-if="item.type === 'signin'">
              <div class="btn" v-if="item.isSignin == 1">已完成</div>
              <div class="btn active" v-else @clcik="signinClick(item.type)">签到</div>
            </template>
            <!-- 邀请 -->
            <template v-if="item.type === 'invite'">
              <div class="btn active" @click="linkToRequest(item.jumpUrl)">去完成</div>
            </template>
            <!-- 阅读资讯 / 浏览产品-->
            <template v-if="item.type === 'read' || item.type === 'look'">
              <div class="btn" v-if="item.count >= item.exchangeTimes">已完成</div>
              <div class="btn active" @clcik="jumpLink(item.jumpUrl, item.type)" v-else-if="item.count > 0 && item.count < item.exchangeTimes">继续完成</div>
              <div class="btn active" @clcik="jumpLink(item.jumpUrl, item.type)" v-else>去完成</div>
              <p v-if="item.count < item.exchangeTimes">已完成{{item.count}}/{{item.exchangeTimes}}</p>
            </template>
          </div>
        </li>
        <!--<li>-->
          <!--<div class="left">-->
            <!--<img src="./img/icon4.png" alt="" class="icon">-->
            <!--<div class="name">-->
              <!--<p class="p1">每日签到</p>-->
              <!--<p class="p2">-->
                <!--<img src="./img/integralIcon.png" alt="" class="integralIcon">-->
                <!--<span>+1</span>-->
              <!--</p>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="right">-->
            <!--<div class="btn active">继续完成</div>-->
            <!--<p>已完成1/5</p>-->
          <!--</div>-->
        <!--</li>-->
      </ul>
    </div>
    <div class="part2">
      <div class="title">积分兑换商品</div>
      <ul>
        <li v-for="(item, index) in integralProducts" :key="index">
          <div class="integral">
            <img src="./img/integralIcon.png" alt="">
            <span>{{item.integral}}</span>
          </div>
          <img :src="item.image_url" alt="" class="img">
          <p class="p1">{{item.name}}</p>
          <p class="p2">{{item.illustrate}}</p>
          <div class="btn" @click="exchangeProduct(item.id, item.integral, item.name)">立即兑换</div>
        </li>
        <!--<li>-->
          <!--<div class="integral">-->
            <!--<img src="./img/integralIcon.png" alt="">-->
            <!--<span>1000</span>-->
          <!--</div>-->
          <!--<img src="./img/icon1.png" alt="" class="img">-->
          <!--<p class="p1">京东e卡</p>-->
          <!--<p class="p2">支持京东自营商品</p>-->
          <!--<div class="btn">立即兑换</div>-->
        <!--</li>-->
      </ul>
    </div>
    <!-- 积分兑换商品弹框 -->
    <product-box v-show="box['productExchange']" :curIntegral="integral" :exchangeId="exchangeId" :exchangeName="exchangeName" @closeMask="closeMask" @isShowVanLoading="isShowVanLoading" @isLoginInvalid="isLoginInvalid"></product-box>
    <!-- 用户违规进入黑名单弹框 -->
    <black-list-box v-show="box['violation']" @closeMask="closeMask"></black-list-box>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import blackListBox from 'components/blackListBox/index';//用户违规进入黑名单弹框
  import productBox from 'components/productBox/index';//积分兑换商品弹框
  import { alertMsg, myAxios, linkToLogin, nativeAppFun, readOrLook } from 'assets/js/utils';
  export default {
    name: 'myIntegral',
    components: {
      vanLoading,
      loginInvalid,
      blackListBox,
      productBox
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        // 是否显示积分兑换弹窗
        box: {
          'productExchange': false,
          'violation': false,
        },
        isBlackList: false,//是否在黑名单中
        exchangeId: 0,// 兑换商品id
        exchangeName: '',// 兑换商品名称
        integral: 0,//总积分
        integralProducts: [],//兑换产品列表
        integralRule: [],//积分规则列表
      }
    },
    created(){
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        if(!!window._dataFromApp.token) {
          this.init();
        }
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
      //进入积分明细
      linkToIntegralDetail() {
        // 事件埋点
        h5EventBuryingPoints('jf', 'click_jf_mx', {});
        nativeAppFun('SR_H5Page',{
          url: location.protocol + '//' + location.host + '/h5/my/integralDetail.html?pageSource=shurongH5',//加载url
        });
      },
      //签到
      signinClick(type) {
        // 事件埋点
        h5EventBuryingPoints('jf', 'click_jf_qd', {});
        //判断是否登录
        if(!linkToLogin()){
          return;
        }
        if(this.isBlackList) {
          this.box['violation'] = true;
          return;
        }
        this.showVanLoading = true;
        myAxios('/srApis/h5/integral/signin', 'get', {
          token: window._dataFromApp.token || '',// 登录token
          type: type
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            alertMsg('签到成功');
            setTimeout(() => {
              location.reload();
            }, 1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
      //跳转邀请页
      linkToRequest(url) {
        // 事件埋点
        h5EventBuryingPoints('jf', 'click_jf_zq ', {});
        url = url.indexOf('?') > -1 ? (url + "&pageSource=shurongH5") : (url + "?pageSource=shurongH5");
        nativeAppFun('SR_H5Page',{
          url: url,//加载url
        });
      },
      //阅读资讯 / 浏览产品
      jumpLink(url, type) {
        if(!url) {
          return;
        }
        url = url.indexOf('?') > -1 ? (url + "&pageSource=shurongH5") : (url + "?pageSource=shurongH5");
        if(type === 'look') {//浏览产品
          // 事件埋点
          h5EventBuryingPoints('jf', 'click_jf_llcp', {});
          readOrLook('look', '', (json) => {
            if(json.loginInvalid) {
              this.loginInvalid = true;
            }else{
              alertMsg(json.message);
            }
          });
        }else{//阅读资讯
          // 事件埋点
          h5EventBuryingPoints('jf', 'click_jf_ydzx', {});
          url += "&myIntegralType=read";
        }
        nativeAppFun('SR_H5Page',{
          url: url,//加载url
        });
      },
      //积分兑换商品（立即兑换）
      exchangeProduct(id, integral, name){
        // 事件埋点
        h5EventBuryingPoints('jf', 'click_jf_sp', {});
        //判断是否登录
        if(!linkToLogin()){
          return;
        }
        if(this.isBlackList) {
          this.box['violation'] = true;
          return;
        }
        if(this.integral < integral) {
          alertMsg('您的积分不足，还需再接再厉');
          return;
        }
        this.exchangeId = id;
        this.exchangeName = name;
        this.box['productExchange'] = true;
      },
      //初始化页面
      init() {
        myAxios('/srApis/h5/integral/index', 'get', {
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data;
            this.integral = data.integral || 0;
            this.integralProducts = data.integralProducts || [];
            this.integralRule = data.integralRule || [];
            this.isBlackList = data.isBlack || false;
            this.isBlackList ? this.box['violation'] = true : this.box['violation'] = false;
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
    background: #fff;
  }
  .myIntegral{
    padding-top: vw(16);
    border-top: vw(10) solid #F2F4F5;
  }
  .top{
    height: vw(178);
    margin: 0 vw(24);
    background: linear-gradient(315deg,rgba(255,244,114,1) 0%,rgba(255,218,65,1) 100%);
    border-radius: vw(12);
    .p1{
      padding-top: vw(38);
      font-size: vw(48);
      color: #333;
      font-weight: 500;
      text-align: center;
    }
    .p2{
      margin-top: vw(10);
      font-size: vw(26);
      color: #333;
      text-align: center;
      img{
        display: inline-block;
        width: vw(18);
        height: vw(18);
        margin-left: vw(10);
      }
    }
  }
  .title{
    padding: vw(48) vw(24) vw(26);
    font-size: vw(36);
    color: #333;
    font-weight: 500;
  }
  .part1{
    ul{
      margin: 0 vw(24);
      box-shadow: 0px 4px 28px 0px rgba(208,208,208,0.38);
    }
    li{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: vw(26) vw(30);
      &:nth-of-type(n + 2) {
        border-top: 1px solid #F2F4F5;
      }
      .left{
        display: flex;
        align-items: center;
      }
      .icon{
        width: vw(70);
        height: vw(70);
        margin-right: vw(34);
        border-radius: 50%;
      }
      .p1{
        font-size: vw(28);
        color: #333;
      }
      .p2{
        margin-top: vw(10);
        font-size: vw(26);
        color: #FF4040;
      }
      .integralIcon{
        display: inline-block;
        width: vw(26);
        height: vw(26);

      }
      .right{
        .btn{
          width: vw(144);
          height: vw(60);
          line-height: vw(60);
          font-size: vw(24);
          color: #B4B4B4;
          text-align: center;
          border-radius: vw(33);
          background: #E6E6E6;
        }
        .active{
          color: #333;
          background: #FFD93B;
        }
        p{
          margin-top: vw(10);
          font-size: vw(18);
          color: #999;
          text-align: center;
        }
      }
    }
  }
  .part2{
    padding-bottom: vw(36);
    ul{
      margin: 0 vw(18) 0 vw(24);
    }
    li{
      display: inline-block;
      width: vw(340);
      height: vw(422);
      padding: vw(16);
      box-shadow: 0px 4px 28px 0px rgba(180,180,180,0.21);
      border-radius:4px;
      box-sizing: border-box;
      margin: 0 vw(6) vw(10) 0;
    }
    .integral{
      text-align: right;
      img{
        display: inline-block;
        width: vw(22);
        height: vw(22);
      }
      span{
        font-size: vw(24);
        color: #FF4040;
      }
    }
    .img{
      display: inline-block;
      width: vw(234);
      height: vw(148);
      margin: vw(20) vw(38) 0;
    }
    .p1{
      margin-top: vw(14);
      font-size: vw(26);
      color: #333;
      text-align: center;
    }
    .p2{
      margin-top: vw(10);
      font-size: vw(22);
      color: #999;
      text-align: center;
    }
    .btn{
      width: vw(160);
      height: vw(60);
      margin: vw(14) auto 0;
      line-height: vw(60);
      border-radius: vw(30);
      font-size: vw(26);
      color: #333;
      text-align: center;
      background: #FFD93B;
    }
  }
</style>
