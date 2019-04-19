<template>
  <!-- icon广告 -->
  <div class="iconAd">
    <ul>
        <li v-for="(item, index) in iconAdList" :key="index" @click="jumpLink(item)">
          <img :src="item.img_url" alt="" @error="imgError(item, 'small.png')">
          <p class="overflowHidden">{{item.extension_title}}</p>
        </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'iconAd',
    components: {
    },
    props: {
      iconAdList: {
        type: Array,
        required: true
      }
    },
    data(){
      return{
      }
    },
    mounted() {
    },
    methods:{
      imgError(item, imgName) {//图片加载失败显示默认图
        item.img_url = require('../../assets/img/'+ imgName);
      },
      jumpLink(item){
        this.$emit('jumpLink', item.link, item.contribution_id, 'click_mk_ic', {
          iconTitle: item.extension_title,
          contributionId: item.contribution_id || '',//稿件id
          Pid: item.daichaoId || "", //商品编码
          Tid: item.tool_id,//工具id
        });
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .iconAd{
    /*padding: vw(24) 0;*/
    background: #fff;
    /*&:nth-of-type(n+2){*/
      /*padding-top: vw(24);*/
    /*}*/
    &.paddingTop{
      padding-top: vw(24);
    }
    &.paddingBottom{
      padding-bottom: vw(24);
    }
    ul{
      display: flex;
      justify-content: space-between;
      width: 92%;
      margin: 0 auto;
      &:nth-of-type(n+2){
        margin-top: vw(20);
      }
    }
    li{
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 33.33%;
      height: vw(200);
      &:nth-of-type(n+2){
        margin-left: vw(16);
      }
      /*padding: vw(18);*/
      text-align: center;
      /*background: #FCF6F8;*/
      img{
        width: vw(100);
        height: vw(100);
        margin: 0 auto vw(10);
      }
    }
  }
  .borderLeftRight{
    li{
      &:nth-of-type(2){
        border-left: 1px solid #F3F3F3;
        border-right: 1px solid #F3F3F3;
      }
    }
  }
  .borderTop{
    ul{
      border-top: 1px solid #F3F3F3;
    }
  }
</style>
