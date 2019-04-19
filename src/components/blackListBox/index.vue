<template>
  <!-- 用户违规进入黑名单弹框 -->
  <div class="violationBox" @touchmove.prevent>
    <div class="box">
      <p>系统检测账号存在违反活动规则行为，已暂停活动参与资格；如有疑问请查看活动规则，或咨询客服</p>
      <div class="btn" @click="closeMask">确定</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'violationBox',
    methods: {
      closeMask() {
        this.$emit('closeMask', 'violation');
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .violationBox{
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
      padding: vw(60) vw(56) vw(34);
      p{
        font-size: vw(30);
        color: #555;
      }
      .btn{
        width: vw(492);
        height: vw(76);
        line-height: vw(76);
        margin: vw(44) auto 0;
        font-size: vw(30);
        color: #333;
        text-align: center;
        border-radius: vw(35);
        background: #FFD93B;
      }
    }
  }
</style>
