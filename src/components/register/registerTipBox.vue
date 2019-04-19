<template>
  <!-- 打开APP提示框 -->
  <div class="mask" @touchmove.prevent>
    <div class="box tipBox">
      <div class="bannerWrap">
        <img src="./img/boxBanner.png" alt="" class="banner">
        <p>
          <span>您已经是</span>
          数融老朋友了哦~
        </p>
      </div>
      <p>邀请您打开客户端抽取每日福利</p>
      <div class="btn">
        <input type="button" value="打开APP" @click="openApp">
      </div>
      <img class="close" src="../../assets/img/close.png" alt="" @click="closeTipBox">
    </div>
  </div>
</template>

<script>
  import { getOsFrom, downloadApp } from 'assets/js/utils';

  export default {
    name: 'registerTipBox',
    components: {
    },
    props: {
      isPage: {
        type: String,
        required: true
      },
      mobile: {
        type: String,
        required: true
      },
      channelCode: {
        type: String,
        required: true
      },
      yqNumber: {
        type: String,
      },
      yqUserId: {
        type: String,
      },
    },
    data(){
      return{
        osFrom: getOsFrom(),// 1 android 2 ios
      }
    },
    created(){
    },
    mounted() {
    },
    methods:{
      closeTipBox(){// 关闭打开APP提示框
        this.$emit('closeTipBox', false);
      },
      openApp(){
        //  事件埋点
        if(this.isPage === 'requestRegister') {
          h5EventBuryingPoints('yq', 'click_yq_dkapp', {
            // mobileNumber: this.mobile,//注册用户手机号
            yqNumber: this.yqNumber,//邀请人手机号
            yqUserId: this.yqUserId//邀请人用户id
          });
        }else if(this.isPage === 'registerChannel'){
          h5EventBuryingPoints('qdzc', 'click_qdzc_dkapp', {
            // mobileNumber: this.mobile,//注册用户手机号
            // dcqdCode: this.channelCode// 贷超渠道编码
          });
        }
        downloadApp(this.osFrom);
      },
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  @import 'assets/css/registerBox.scss';
  .tipBox{
    width: vw(600);
    height: vw(530);
    .bannerWrap{
      position: relative;
      .banner{
        width: 100%;
      }
      p{
        position: absolute;
        top: vw(10);
        left: 0;
        right: 0;
        font-size: vw(38);
        color: #fff;
      }
      span{
        display: block;
        margin-bottom: vw(10);
        font-size: vw(34);
      }
    }
    p{
      margin-top: vw(30);
      font-size: vw(26);
      text-align: center;
    }
  }

</style>
