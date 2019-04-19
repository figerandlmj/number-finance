<template>
  <!-- 底部提示语 -->
  <div class="bottomTip">
    <template v-for="item in bottomTip">
      <!-- 主标题 -->
      <div class="mainTitle">
        <span class="line"></span>
        <span class="title" @click="jumpLink(item.main_link, item.main_title)">{{item.main_title}}</span>
        <span class="line"></span>
      </div>
      <!-- 副标题 -->
      <p class="subTitle" @click="jumpLink(item.vice_link, item.vice_title)">{{item.vice_title}}</p>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'bottomTip',
    components: {
    },
    props: {
      bottomTip: {
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
      jumpLink(link, title){
        this.$emit('jumpLink', link, "", 'click_mk_db', {
          tipsTitle: title
        });
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .bottomTip{
    margin: vw(30) 0 vw(46);
    text-align: center;
    .mainTitle{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      font-size: vw(28);
      color: #4B8BEB;
      .title{
        margin: 0 vw(30);
      }
      .line{
        flex: 1;
        height: 1px;
        background: #e1e1e1;
      }
    }
    .subTitle{
      margin-top: vw(10);
      font-size: vw(24);
      color: #9F9F9F;
    }
  }
</style>
