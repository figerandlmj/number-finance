<template>
  <!-- 单图广告 -->
  <div class="imgAdOne">
    <ul>
      <li v-for="(item, index) in imgList" :key="index" @click="jumpLink(item)">
        <p class="title" v-show="item.title">{{item.title}}</p>
        <img :src="item.img_url" alt="" @error="imgError(item, 'large.jpg')">
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'imgAdOne',
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
      }
    },
    mounted() {
    },
    methods:{
      imgError(item, imgName) {//图片加载失败显示默认图
        item.img_url = require('../../assets/img/'+ imgName);
      },
      jumpLink(item){
        this.$emit('jumpLink', item.link, item.contribution_id, 'click_mk_xt', {
          picId: item.relate_id, //轮播图ID
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
  .imgAdOne{
    padding: vw(24);
    background: #fff;
    li{
      &:nth-of-type(n+2){
        margin-top: vw(24);
      }
    }
    .title{
      margin-bottom: vw(20);
      font-size: vw(36);
      color: #333;
      font-weight: bold;
    }
    img{
      /*height: vw(160);*/
    }
  }
</style>
