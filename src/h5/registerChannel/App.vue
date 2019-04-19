<template>
  <div class="registerContainer">
    <img :src="bgImg" alt="" class="bg">
    <div class="registerWrap">
      <div class="telWrap">
        <input type="tel" placeholder="请输入手机号" v-model="telValue" @input="telInput" @focus="phoneFocus">
      </div>
      <div class="codeWrap">
        <input class="code" type="tel" placeholder="请输入短信验证码" v-model="shotMsgCodeValue" @input="shotMsgCodeInput" @focus="shotMsgCodeFocus">
        <input class="btn" type="button" value="点击获取" v-show="isGetCode" @click="showCodeMask" :style="{background: btnColor}">
        <input class="btn active" type="button" :value="count + 's'" v-show="!isGetCode">
      </div>
      <div class="protocolWrap">
        <img src="./img/selected.png" alt="" :style="{background: btnColor}">
        <span>阅读并同意<a href="./agreementRegister.html" :style="{color: btnColor}">《数融用户协议》</a></span>
      </div>
      <div class="btnWrap">
        <input type="button" :value="btnWord" @click="confirmRegister" :style="{background: btnColor}">
      </div>
    </div>
    <!-- 图形验证码弹框 -->
    <img-code-box v-if="isShowCodeBox" :mobile="telValue" :btnColor="btnColor" :pointCode="'qdzc'" @isShowVanLoading="isShowVanLoading" @getShotMsgCode="getShotMsgCode" @closeCodeBox="closeCodeBox" @openTipBox="isShowTip"></img-code-box>
    <!-- 打开APP提示框 -->
    <register-tip-box v-if="isShowTipBox" :isPage="isPage" :mobile="telValue" :channelCode="channelCode" @closeTipBox="isShowTip"></register-tip-box>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <is-weixin-mask v-if="isWeixinOs"></is-weixin-mask>
  </div>
</template>

<script>
  import vanLoading from 'components/vanLoading/index';
  import imgCodeBox from 'components/register/imgCodeBox';
  import registerTipBox from 'components/register/registerTipBox';
  import isWeixinMask from 'components/isWeixinMask/index';
  import { getUrlPara, alertMsg, downloadUrl, userAgent, getOsFrom, myAxios } from 'assets/js/utils';

  export default {
    name: 'requestRegister',
    components: {
      vanLoading,
      imgCodeBox,
      registerTipBox,
      isWeixinMask,
    },
    props: {
    },
    data(){
      return{
        isWeixinOs: false,//是否微信浏览器
        osFrom: getOsFrom(),// 1 android 2 ios
        countDown: 60,//倒计时60s
        isPage: 'registerChannel',// 页面标识
        channelCode: getUrlPara('channel'),// 渠道
        isShowTipBox: false,// 是否显示打开APP提示框
        showVanLoading: false,// 是否显示vanLoading
        isShowCodeBox: false,// 是否显示图形验证码弹窗
        telValue: '',// 手机号码输入值
        shotMsgCodeValue: '', //短信验证码输入值
        count: 60,// 倒计时
        isGetCode: true,// 是否显示获取短信验证码按钮
        imgCodeValue: '',// 图形验证码输入值
        bgImg: require('./img/bg.png'),//背景图片
        btnColor: '#3A7FFF',//按钮颜色
        btnWord: '立即借款',//按钮文字
      }
    },
    created(){
      this.init();
      downloadUrl();
      window.myOnload();
      let agent = userAgent();
      if(agent === 'weixin' && this.osFrom === 1) {
        this.isWeixinOs = true;
      }
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    methods:{
      //初始化页面
      init() {
        myAxios('/srApp/h5/spread/index', 'get', {
          tempCode: 1
        }, (json) => {
          if(json.code === 200) {
            let data = json.data;
            this.bgImg = data.backUrl;
            this.btnColor = data.btnColor;
            this.btnWord = data.btnText;
          }else{
            alertMsg(json.message);
          }
        });
      },
      isShowVanLoading(flag){// 是否显示vanLoading
        this.showVanLoading = flag;
      },
      closeCodeBox(){// 关闭图形验证码弹窗
        this.isShowCodeBox = false;
      },
      isShowTip(flag){// APP提示框
        this.isShowTipBox = flag;
      },
      showCodeMask(){// 点击获取验证码打开图形验证码弹窗
        if(this.telValue === '') {// 非空验证
          alertMsg('请输入手机号码');
          return;
        }
        if(!/^1(3|4|5|7|8)\d{9}$/.test(this.telValue)) {// 11位数字验证
          alertMsg('手机号有误，请重新输入');
          return;
        }
        this.imgCodeValue = '';
        this.isShowCodeBox = true;
      },
      telInput(){// 手机号码input事件
        this.telValue = this.telValue.replace(/[^\d]/g,'');
        this.telValue = this.telValue.slice(0, 11);
      },
      shotMsgCodeInput(){//短信验证码input事件
        this.shotMsgCodeValue = this.shotMsgCodeValue.replace(/[^\d]/g,'');
        this.shotMsgCodeValue = this.shotMsgCodeValue.slice(0, 6);
      },
      countDown60(){// 倒计时60s
        this.isGetCode = false;
        this.count = this.countDown;
        let timer = setInterval(() => {
          if(this.count === 0) {
            clearInterval(timer);
            this.isGetCode = true;
            return;
          }
          this.count --;
        }, 1000);
      },
      confirmRegister(){// 立即加入
        if(this.shotMsgCodeValue === '') {
          alertMsg('请输入短信验证码');
          return;
        }
        let len = this.shotMsgCodeValue.length;
        if(len !== 4 && len !== 6) {
          alertMsg('请输入正确的短信验证码');
          return;
        }
        //  事件埋点
        h5EventBuryingPoints('qdzc', 'click_qdzc_zc', {});
        this.register();
      },
      getShotMsgCode(imgCode){// 获取短信验证码
        this.isShowCodeBox = false;
        this.showVanLoading = true;
        myAxios('/srApis/h5/sendSms', 'get', {
          mobile: this.telValue,
          imageCode: imgCode,
        }, (json) => {
          this.showVanLoading = false;
          if(json.code === 200) {
            alertMsg('短信已发送');
            this.countDown60();
          }else{
            alertMsg(json.message);
          }
        });
      },
      register(){// 注册
        this.showVanLoading = true;
        myAxios('/srApis/h5/register', 'get', {
          mobile: this.telValue,
          smsCode: this.shotMsgCodeValue,
          channelCode: this.channelCode,
          osType: this.osFrom === 1 ? 'android' : 'ios'
        }, (json) => {
          this.showVanLoading = false;
          if(json.code === 200) {
            window.location.href = './registerResult.html?mobile=' + this.telValue + '&channel=' + this.channelCode;
          }else if(json.code === 1002) {
            $('body').scrollTop(0);
            this.isShowTip(true);
          }else{
            alertMsg(json.message);
          }
        });
      },
      //手机号输入框获取焦点事件
      phoneFocus() {
        //  事件埋点
        h5EventBuryingPoints('qdzc', 'click_qdzc_sjhsr', {});
      },
      //短信验证码输入框获取焦点事件
      shotMsgCodeFocus() {
        //  事件埋点
        h5EventBuryingPoints('qdzc', 'click_qdzc_dxyz', {});
      }
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
  .registerContainer{
    position: relative;
    .bg{
      width: 100%;
    }
  }
  .registerWrap{
    position: absolute;
    top: vw(440);
    left: 0;
    right: 0;
    z-index: 9;
    width: vw(630);
    margin: auto;
  }
  .telWrap{
    input{
      width: vw(630);
      height: vw(90);
      padding: vw(30) vw(20);
      margin-top: vw(56);
      font-size: vw(28);
      background: #fff;
      border-radius: vw(12);
      box-sizing: border-box;
    }
  }
  .codeWrap{
    display: flex;
    justify-content: space-between;
    margin: vw(26) auto 0;
    .code{
      width: vw(384);
      height: vw(90);
      padding: vw(30) vw(20);
      font-size: vw(28);
      background: #fff;
      border-radius: vw(12);
    }
    .btn{
      width: vw(212);
      height: vw(88);
      font-size: vw(30);
      color: #fff;
      font-weight: 500;
      background: #3A7FFF;
      border-radius: vw(12);
      &.active{
        color: #fff;
        background: #ccc;
      }
    }
  }
  .protocolWrap{
    display: flex;
    align-items: center;
    margin-top: vw(28);
    font-size: vw(24);
    color: #9F9F9F;
    img{
      width: vw(28);
      height: vw(28);
      padding: vw(9) vw(6);
      margin-right: vw(12);
      box-sizing: border-box;
      border-radius: vw(8);
      background: #3A7FFF;
    }
    a{
      display: inline-block;
      font-size: vw(24);
      color: #3A7FFF;
    }
  }
  .btnWrap{
    margin: vw(24) auto 0;
    input{
      width: vw(630);
      height: vw(90);
      font-size: vw(30);
      color: #fff;
      font-weight: 500;
      background: #3A7FFF;
      border-radius: vw(12);
      box-sizing: border-box;
    }
  }
</style>
