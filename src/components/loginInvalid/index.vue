<template>
  <!-- 登录失效弹框 -->
  <div class="loginInvalidBox" @touchmove.prevent v-show="loginInvalid">
    <div class="box">
      <p>登录状态失效，请重新登录</p>
      <div class="btn" @click="confirmLoginInvalid">确定</div>
    </div>
  </div>
</template>

<script>
  import { nativeAppFun } from 'assets/js/utils';
  export default {
    name: 'loginInvalidBox',
    props: {
      loginInvalid: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      //登录状态失效弹框点确定
      confirmLoginInvalid(){
        nativeAppFun('SR_LoginPage');//跳转登录
      },
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .loginInvalidBox{
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
      padding: vw(112) vw(90) vw(34);
      text-align: center;
      background: #fff;
      border-radius: vw(10);
    }
    p{
      font-size: vw(30);
      color: #555;
    }
    .btn{
      width: vw(492);
      height: vw(76);
      line-height: vw(76);
      margin: vw(68) auto 0;
      font-size: vw(30);
      color: #333;
      text-align: center;
      border-radius: vw(35);
      background: #FFD93B;
    }
  }
</style>
