<template>
  <!-- 图文卡片 -->
  <div class="imgWordCard" @click="jumpLink(imgWordData)">
    <img :src="imgWordData.pic" alt="" @error="imgError(imgWordData, 'large.jpg')">
    <div class="word">
      <div class="wrap">
        <div class="title">{{imgWordData.spreadTitle}}</div>
        <div class="content">{{imgWordData.spreadContent}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'imgWordCard',
    components: {
    },
    props: {
      imgWordArr: {
        type: Array,
        required: true
      }
    },
    data(){
      return{
        imgWordData: {}
      }
    },
    created() {
      this.imgWordData = this.imgWordArr[0];
    },
    mounted() {
    },
    methods:{
      imgError(item, imgName) {//图片加载失败显示默认图
        item.pic = require('../../assets/img/'+ imgName);
      },
      jumpLink(item){
        this.$emit('jumpLink', item.url, item.contributionId, 'click_mk_twkp', {
          picTitle: item.spreadTitle,//标题
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
  .imgWordCard{
    position: relative;
    height: vw(456);
    img{
      width: 100%;
      height: vw(330);
    }
    .word{
      position: absolute;
      top: vw(244);
      left: 0;
      right: 0;
      height: vw(212);
      margin: auto;
      padding: 0 vw(24);
    }
    .wrap{
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 4px;
      box-shadow: -10px -4px 44px 0px rgba(215,215,215,0.5);
    }
    .title{
      padding: vw(28) vw(24) vw(20);
      font-size: vw(33);
      color: #333;
      font-weight: 700;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .content{
      height: vw(80);
      padding: 0 vw(24);
      font-size: vw(28);
      color: #555;
      line-height: vw(40);
      overflow: hidden;
    }
  }
</style>
