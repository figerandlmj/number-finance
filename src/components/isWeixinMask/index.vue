<template>
  <!-- 微信中页面提示浏览器中打开-->
  <div class="isWeixinMask">
    <img src="../../assets/img/live_weixin.png" alt="" class="isWeixin">
  </div>
</template>

<script>
  export default {
    name: 'isWeixinMask'
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .isWeixinMask{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,.7);
    .isWeixin{
      position: absolute;
      top: 0;
      right: vw(10);
      width: vw(275);
      height: vw(218);
    }
  }
</style>
