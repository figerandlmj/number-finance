<template>
  <!-- 轮播图片广告1 -->
  <div class="imgSwipe">
    <van-swipe :autoplay="300000" :show-indicators="true">
      <van-swipe-item v-for="(item, vanIndex) in imgList" :key="vanIndex">
        <a @click="jumpLink(item)">
          <img :src="item.img_url" alt="" @error="imgError(item, 'large.jpg')">
          <div class="title overflowHidden" v-show="item.title">{{item.title}}</div>
        </a>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
  import { Swipe, SwipeItem } from 'vant';

  export default {
    name: 'imgSwipe',
    components: {
      vanSwipe: Swipe,
      vanSwipeItem: SwipeItem,
    },
    props: {
      imgList: {
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
        this.$emit('jumpLink', item.link, item.contribution_id, 'click_mk_dt', {
          picId: item.relate_id,//轮播图ID
          picTitle: item.title,
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
  .imgSwipe{
    padding: 0 vw(24);
    background: #fff;
    .van-swipe{
      width: 100%;
      padding-top: vw(20);
      margin: 0 auto;
    }
    .van-swipe-item{
      position: relative;
      img{
        height: vw(300);
        border-radius: vw(12);
      }
      .title{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        /*height: vw(90);*/
        height: vw(78);
        padding: 0 vw(20);
        line-height: vw(60);
        font-size: vw(26);
        color: #fff;
        /*background: rgba(0,0,0,.6);*/
        background:linear-gradient(top, rgba(255,255,255,.01), rgba(0,0,0,.5));
        border-bottom-left-radius: vw(14);
        border-bottom-right-radius: vw(14);
      }
    }
    .van-swipe__indicators{
      bottom: vw(16);
      /*left: auto;*/
      /*right: 0;*/
    }
    .van-swipe__indicator{
      /*background-color: transparent;*/
      /*border: 1px solid #fff;*/
      width: vw(8);
      height: vw(8);
      background-color: rgba(255,255,255,1);
      opacity: 0.3653;
    }
    .van-swipe__indicator--active{
      /*background-color: #fff;*/
      width: vw(14);
      height: vw(8);
      background-color: #FFD93B;
      border-radius: vw(4);
      opacity: 1;
    }
  }
</style>
