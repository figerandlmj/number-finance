<template>
  <!-- 注册成功 -->
  <div class="registerResult">
    <img :src="bgImg" alt="" class="bg" @click="openApp">
    <is-weixin-mask v-if="isWeixinOs"></is-weixin-mask>
  </div>
</template>

<script>
  import isWeixinMask from 'components/isWeixinMask/index';
  import { getUrlPara, getOsFrom, userAgent, downloadApp, downloadUrl, myAxios } from 'assets/js/utils';

  export default {
    name: 'registerResult',
    components: {
      isWeixinMask,
    },
    props: {
    },
    data(){
      return{
        yqNumber: getUrlPara('yqNumber'),//邀请人手机号
        yqUserId: getUrlPara('yqUserId'),//邀请人用户id
        mobile: getUrlPara('mobile'),//注册手机号
        dcqdCode: getUrlPara('channel'),//贷超渠道编码
        osFrom: getOsFrom(),// 1 android 2 ios
        isWeixinOs: false,//是否微信浏览器
        bgImg: require('./img/bg.png'),//背景图
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
          tempCode: 4
        }, (json) => {
          if(json.code === 200) {
            let data = json.data;
            this.bgImg = data.backUrl;
          }else{
            alertMsg(json.message);
          }
        });
      },
      openApp(){// 下载客户端
        //  事件埋点
        h5EventBuryingPoints('qdzc', 'click_yq_xzapp', {
          // "mobileNumber": this.mobile,//注册用户手机号
          // "dcqdCode": this.dcqdCode//贷超渠道编码
          yqNumber: this.yqNumber,
          yqUserId: this.yqUserId
        });
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
    background: #f7f7f7;
  }
  .registerResult{
    .bg{
      width: 100%;
    }
  }
</style>
