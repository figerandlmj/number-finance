<template>
  <!-- vanLoading -->
  <div class="vanLoadingMask" @touchstart.prevent>
    <div class="box">
      <loading type="spinner" color="white" />
    </div>
  </div>
</template>

<script>
  import { Loading } from 'vant';
  export default {
    name: 'vanLoading',
    components: {
      Loading
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  /* vanLoading */
  .vanLoadingMask{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0);
    .box {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      margin-top: vw(-180);
      z-index: 99999;
    }
    .van-loading--white {
      padding: 10px;
      border-radius: 3px;
      background-color: rgba(0, 0, 0, .5);
      box-sizing: content-box;
    }
  }
</style>
