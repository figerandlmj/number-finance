<template>
  <!-- 积分兑换商品弹框 -->
  <div class="productBox" @touchmove.prevent>
    <div class="box">
      <img src="./img/smile.png" alt="" class="smile">
      <img src="../../assets/img/close2.png" alt="" class="close" @click="closeMask">
      <input type="tel" placeholder="请输入领取礼品卡的手机号码" class="tel" v-model="telValue" @input="telInput">
      <p>* 积分兑换的商品将在7日内发放到该手机，<br>请关注短信消息。</p>
      <input type="button" value="确定" class="confirm" @click="confirmProduct">
    </div>
  </div>
</template>

<script>
  import { myAxios, alertMsg } from 'assets/js/utils';
  export default {
    name: 'productBox',
    props: {
      exchangeId: {// 兑换商品id
        type: Number,
        required: true
      },
      curIntegral: {// 当前积分
        type: Number,
        required: true
      },
      exchangeName: {// 兑换商品名称
        type: String,
        required: true
      }
    },
    data() {
      return {
        telValue: '',// 积分兑换手机号
      }
    },
    methods: {
      // 手机号码input事件
      telInput() {
        this.telValue = this.telValue.replace(/\D/g,'');
        this.telValue = this.telValue.slice(0, 11);
      },
      // 积分兑换商品（确认兑换）
      confirmProduct(){
        if(this.telValue === '') {// 非空验证
          alertMsg('请输入手机号码');
          return;
        }
        if(!/^1(3|4|5|7|8)\d{9}$/.test(this.telValue)) {// 11位数字验证
          alertMsg('手机号码有误，请重新输入');
          return;
        }
        this.integralExchangeProduct();
      },
      // 积分兑换商品
      integralExchangeProduct(){
        this.$emit('isShowVanLoading', true);
        myAxios('/srApis/h5/exchange', 'get', {
          token: window._dataFromApp.token || '',// 登录token
          mobile: this.telValue,
          integral_product_id: this.exchangeId,
        }, (json) => {
          this.$emit('isShowVanLoading', false);
          // 事件埋点
          h5EventBuryingPoints('zq', 'click_zq_dh', {
            pointsNo: this.curIntegral,
            goodsName: this.exchangeName,
            isSuccess: json.code === 200 ? 'changeSuccess' : 'changeError'
          });
          if(json.loginInvalid) {
            this.$emit('isLoginInvalid', true);
          }else if(json.code === 200) {
            alertMsg('提交成功，7日内发放至该手机号');
            this.closeMask();
            setTimeout(function(){
              location.reload();
            },1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
      closeMask() {
        this.$emit('closeMask', 'productExchange');
      },
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .productBox{
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
      .smile{
        position: absolute;
        top: vw(-50);
        left: 0;
        right: 0;
        width: vw(233);
        height: vw(128);
        margin: auto;
      }
      .close{
        position: absolute;
        top: vw(30);
        right: vw(24);
        width: vw(30);
        height: vw(28);
      }
      .tel{
        width: 70%;
        padding: vw(16) vw(12);
        margin-top:vw(112);
        font-size: vw(28);
        color: #000;
        border: 1px solid #ccc;
        border-radius: vw(10);
        text-align: center;
      }
      p{
        margin: vw(26) 0 vw(68);
        font-size: vw(20);
        color: #B8B7B7;
        line-height: vw(40);
      }
      .confirm{
        width: 50%;
        height: vw(76);
        margin-bottom: vw(60);
        font-size: vw(30);
        color: #fff;
        background: #F3533D;
        border-radius: vw(38);
      }
    }
  }
</style>
