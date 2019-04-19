<template>
  <!-- 滑动卡片 -->
  <div class="slideCard">
    <div class="title">{{imgList[0].title}}</div>
    <div class="imgsWrapper" ref="imgsWrapper">
      <ul class="wrapper" :style="{width: wrapperWidth / 750 * 100 + 'vw'}">
        <li v-for="(item, index) in imgList" :key="index" @click="jumpLink(item)">
          <img :src="item.pic" alt="" @error="imgError(item, 'middle.jpg')">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: 'slideCard',
    components: {
    },
    props: {
      imgList: {
        type: Array,
        required: true
      }
    },
    data(){
      return{
        wrapperWidth: 872,//滑动卡片宽度
      }
    },
    mounted() {
      // this.initScroll();
      this.wrapperWidth = (280 + 16) * this.imgList.length -16;
    },
    methods:{
      // initScroll() {
      //   this.imgScroll = new BScroll(this.$refs.imgsWrapper);
      // },
      imgError(item, imgName) {//图片加载失败显示默认图
        item.pic = require('../../assets/img/'+ imgName);
      },
      jumpLink(item){
        this.$emit('jumpLink', item.url, item.contributionId, 'click_mk_hdkp', {
          picTitle: item.title,
          contributionId: item.contributionId || '',//稿件id
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
  .slideCard{
    .title{
      padding: vw(20) vw(24) 0;
      font-size: vw(36);
      color: #333;
      font-weight: bold;
    }
    .imgsWrapper{
      position:relative;
      z-index:0;
      margin-top: vw(10);
      padding-left: vw(24);
      overflow-x: scroll;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      .wrapper{
        /* 280 * 3 + 16 * 2 = 872 */
        /* 280 * 10 + 16 * 9 = 2944 */
        display: flex;
        justify-content: space-between;
        width: vw(872);
        height: vw(152);
        padding-right: vw(24);
      }
      li{
        display: inline-block;
        width: vw(280);
        height: vw(152);
        &:nth-of-type(n + 2) {
          margin-left: vw(16);
        }
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
