<template>
  <div class="cashWithdrawal">
    <div class="topTip">提现金额（元）</div>
    <ul class="inputWrap">
      <li class="inputMoney">
        <span>￥</span>
        <input type="number" :placeholder="'最低提现金额为' + lowCash" v-model="money" @input="moneyInput">
      </li>
      <li>
        <div class="abledCash">可提现金额<span>{{abledCash}}元</span></div>
        <div class="allCashBtn" @click="allCash">全部提现</div>
      </li>
      <li>
        <input type="number" placeholder="请输入短信验证码" maxlength="6" class="codeInput" v-model="msgCode" @input="msgCodeInput">
        <div class="getMsgCode active" v-if="money > 0 && isGetCode" @click="getMsgCode">获取验证码</div>
        <div class="getMsgCode" v-else-if="!isGetCode">{{count}}s</div>
        <div class="getMsgCode" v-else>获取验证码</div>
      </li>
    </ul>
    <div class="mainBankCard">
      <div class="left">
        <!--<img src="./img/bankIcon.png" alt="">-->
        <img :src="bankImg" alt="">
        <span>{{bankName}}</span>
      </div>
      <div class="right">尾号{{cardNo.substring(cardNo.length - 4)}}</div>
    </div>
    <p class="bottomTip">如需更改提现主卡，请前往&lt;我的-银行卡&gt;设置</p>
    <div class="submit active" v-if="money > 0 && msgCode" @click="submitCash">立即提现</div>
    <div class="submit" v-else>立即提现</div>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  // import { Dialog } from 'vant';
  // import Vue from 'vue';
  // Vue.use(Dialog);
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { alertMsg, myAxios } from 'assets/js/utils';
  export default {
    name: 'cashWithdrawal',
    components: {
      vanLoading,
      loginInvalid
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        msgCode: '',//短信验证码
        money: '',//提现金额
        lowCash: 0,//最低提现金额
        maxCash: '',//最高可提现金额
        abledCash: 0,//可提现金额
        bankName: '',//银行的名称
        bankImg: '',//银行的图片链接
        cardNo: '',//银行卡号
        phone: '',//用户手机号
        isGetCode: true,//是否可点击获取验证码
        count: 60,//倒计时
        isUpperLimit: false,//提现次数是否达上限
      }
    },
    created(){
      // this.init();
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
    beforeDestroy(){

    },
    methods:{
      //初始化页面
      init() {
        myAxios('/srApis/apis/bank/getBankNo', 'post', {
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data;
            this.lowCash = data.min;
            this.maxCash = data.max;
            this.abledCash = data.remainingSum || 0;
            this.bankName = data.bank;
            this.bankImg = data.icon;
            this.cardNo = data.cardNo;
            this.phone = data.phone;
            this.isUpperLimit = data.isLimite;
          }else{
            alertMsg(json.message);
          }
        });
      },
      //短信验证码input事件
      msgCodeInput() {
        this.msgCode = this.msgCode.replace(/\D/g,'');
        this.msgCode = this.msgCode.slice(0, 6);
      },
      //提现金额input事件
      moneyInput() {
        this.money = this.money.replace(/^([1-9]\d*(\.[\d]{0,2})?|0(\.[\d]{0,2})?)[\d.]*/g, '$1');
        this.money = this.money.replace(/^([1-9]\d{8})\d*/g, '$1');
        this.money = this.money.replace(/[^\d\.]/g, '');
        this.money = this.money.replace(/^\./g, '');
        this.money = this.money.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        this.money = this.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      },
      //点击获取短信验证码
      getMsgCode() {
        if(this.isUpperLimit) {
          alertMsg('今日提现次数已达到上限');
          // Dialog.alert({
          //   message: '今日提现次数已达到上限',
          // }).then(() => {
          //   // on close
          // });
          return;
        }
        // 事件埋点
        h5EventBuryingPoints('zhye', 'click_zhye_hq', {});

        if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(this.money)) {
          alertMsg('请输入正确的金额');
          return;
        }
        if(this.money < this.lowCash) {
          alertMsg('金额不足，最低提现金额为' + this.lowCash);
          return;
        }
        if(this.money > this.maxCash) {
          alertMsg('转出金额超限，最高提现金额为' + this.maxCash);
          return;
        }
        if(this.money > this.abledCash) {
          alertMsg('余额不足，可提现金额为' + this.abledCash);
          return;
        }
        this.showVanLoading = true;
        //发送短信验证码
        myAxios('/srApis/apis/bank/sms', 'post', {
          token: window._dataFromApp.token || ''
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200) {
            alertMsg('短信验证码已发送至' + this.phone + '，请注意查收');
            this.countDown60();
          }else{
            alertMsg(json.message);
          }
        });
      },
      //倒计时60s
      countDown60(){
        this.isGetCode = false;
        this.count = 60;
        let timer = setInterval(() => {
          if(this.count === 0) {
            clearInterval(timer);
            this.isGetCode = true;
            return;
          }
          this.count --;
        }, 1000);
      },
      //余额提现
      submitCash() {
        if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(this.money)) {
          alertMsg('请输入正确的金额');
          return;
        }
        if(this.money < this.lowCash) {
          alertMsg('金额不足，最低提现金额为' + this.lowCash);
          return;
        }
        if(this.money > this.maxCash) {
          alertMsg('转出金额超限，最高提现金额为' + this.maxCash);
          return;
        }
        this.showVanLoading = true;
        myAxios('/srApis/apis/remainingSum/cash', 'post', {
          code: this.msgCode,
          cashCount: this.money,
          token: window._dataFromApp.token || ''
        }, (json) => {
          this.showVanLoading = false;
          // 事件埋点
          h5EventBuryingPoints('zhye', 'click_zhye_tx', {
            Result: json.code === 200 ? 'success' : 'fail'
          });
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200) {
            alertMsg('提现成功');
            setTimeout(() => {
              location.reload();
            }, 1500);
          }else if(json.code === 5028) {
            alertMsg('提现处理中');
            setTimeout(() => {
              location.reload();
            }, 1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
      //全部提现
      allCash() {
        this.money = this.abledCash;
      },
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  body{
    background: rgb(242,242,242);
  }
  .van-dialog__message{
    text-align: center;
  }
  .van-dialog__confirm,
  .van-dialog__confirm:active{
    color: #2C8CF1;
  }
  .cashWithdrawal{
    .topTip{
      padding: vw(46) vw(24);
      font-size: vw(30);
      color: #666;
      background: #fff;
    }
    .inputWrap{
      padding: 0 vw(24);
      background: #fff;
      li{
        display: flex;
        align-items: center;
        height: vw(106);
        &:nth-of-type(n+2){
          justify-content: space-between;
          border-top: 1px solid #F3F3F3;
        }
        input{
          height: 100%;
        }
      }
      .inputMoney{
        span{
          margin-right: vw(26);
          font-size: vw(56);
          color: #333;
        }
        input{
          flex: 1;
          font-size: vw(40);
          color: #333;
        }
      }
      .abledCash{
        font-size: vw(30);
        color: #999;
        span{
          color: #FD4014;
        }
      }
      .allCashBtn{
        font-size: vw(30);
        color: #2C8CF1;
      }
      .codeInput{
        flex: 1;
        font-size: vw(30);
        color: #333;
      }
      .getMsgCode{
        padding: vw(10) vw(16);
        font-size: vw(28);
        color: #BABABA;
        text-align: center;
        border: 1px solid #BABABA;
        border-radius: 3px;
        &.active{
          color: #2C8CF1;
          border: 1px solid #2C8CF1;
        }
      }
    }
    .mainBankCard{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: vw(20);
      padding: vw(24);
      background: #fff;
      .left{
        display: flex;
        align-items: center;
      }
      img{
        width: vw(60);
        height: vw(60);
        margin-right: vw(24);
      }
      span{
        font-size: vw(26);
        color: #505050;
      }
      .right{
        font-size: vw(26);
        color: #999;
      }
    }
    .bottomTip{
      padding: vw(22) vw(24) vw(172);
      font-size: vw(24);
      color: #AEAEAE;
    }
    .submit{
      width: vw(670);
      height: vw(88);
      margin: 0 auto;
      line-height: vw(88);
      font-size: vw(32);
      color: #BABABA;
      text-align: center;
      background: rgba(229,229,229,1);
      border-radius: vw(40);
      &.active{
        color: #333;
        background: #FFD93B;
      }
    }
  }
</style>
