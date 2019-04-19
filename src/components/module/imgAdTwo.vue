<template>
  <!-- 双图广告 -->
  <div class="imgAdTwo">
    <ul>
      <li v-for="(item, index) in imgList" :key="index">
        <p class="title" v-show="item.title">{{item.title}}</p>
        <div class="imgs">
          <p @click="jumpLink(item.link, item.contribution_id, item.daichaoId, item.tool_id, item.title, item.relate_id)">
            <img :src="item.img_url" alt="" @error="imgError(item, 'middle.jpg')">
          </p>
          <p @click="jumpLink(item.link2, item.contribution_id2, item.daichaoId2, item.tool_id2, item.title, item.relate_id2)">
            <img :src="item.img_url2" alt="" @error="imgError(item, 'middle.jpg')">
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'imgAdTwo',
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
      jumpLink(link, id, daichaoId, toolId, title, relateId){
        this.$emit('jumpLink', link, id, 'click_mk_st', {
          picId: relateId,//轮播图ID
          picTitle: title,
          contributionId: id || '',//稿件id
          Pid: daichaoId || "", //商品编码
          Tid: toolId || '',//工具id
        });
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .imgAdTwo{
    padding: vw(24);
    background: #fff;
    li{
      &:nth-of-type(n+2){
        padding-top: vw(24);
      }
    }
    .title{
      margin-bottom: vw(20);
      font-size: vw(36);
      color: #333;
      font-weight: bold;
    }
    .imgs{
      display: flex;
      justify-content: space-between;
      p{
        flex: 1;
        height: vw(160);
        &:nth-of-type(n+2){
          margin-left: vw(14);
        }
      }
      img{
        height: 100%;
        border-radius: vw(6);
      }
    }
  }
</style>
