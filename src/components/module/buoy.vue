<template>
  <!-- 右侧角标 -->
  <div class="buoy">
    <template v-for="item in buoy">
      <img :src="item.img_url" alt="" @error="imgError(item, 'small.png')" @click="jumpLink(item)">
    </template>
  </div>
</template>

<script>
  export default {
    name: 'buoy',
    components: {
    },
    props: {
      buoy: {
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
        this.$emit('jumpLink', item.link, "", 'click_mk_fdic', {}, item.ad_type);
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .buoy{
    position: fixed;
    right: 0;
    bottom: vw(200);
    img{
      width: vw(100);
    }
  }
</style>
