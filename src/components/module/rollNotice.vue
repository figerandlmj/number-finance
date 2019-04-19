<template>
  <!-- 跑马灯公告 -->
  <div class="rollNotice">
    <div class="wrap" @click="jumpLink">
      <img src="./img/notice.png" alt="">
      <yd-roll-notice :autoplay="autoplay">
        <yd-roll-notice-item v-for="(item, index) in noticeList" :key="index">
          <div class="overflowHidden" :class="{isLink: item.link || item.contribution_id}" :dataIndex="index">{{item.propagate_text}}</div>
        </yd-roll-notice-item>
      </yd-roll-notice>
    </div>
  </div>
</template>

<script>
  import { RollNotice, RollNoticeItem } from 'vue-ydui/dist/lib.rem/rollnotice';

  export default {
    name: 'rollNotice',
    components: {
      ydRollNotice: RollNotice,
      ydRollNoticeItem: RollNoticeItem
    },
    props: {
      noticeList: {
        type: Array,
        required: true
      }
    },
    data(){
      return{
        autoplay: 3000
      }
    },
    created(){
      if(typeof(this.noticeList[0]) === 'object' && this.noticeList[0].switch_speed){
        this.autoplay = this.noticeList[0].switch_speed * 1000;
      }
    },
    mounted() {
    },
    methods:{
      jumpLink(e){
        let className = e.target.className;
        let dataIndex = e.target.getAttribute('dataIndex');
        if(className.indexOf('isLink') > -1) {
          let obj = this.noticeList[dataIndex];
          this.$emit('jumpLink', obj.link, obj.contribution_id, 'click_mk_pmd', {
            lampTitle: obj.propagate_text,
            contributionId: item.contribution_id || '',//稿件id
            Pid: item.daichaoId || "", //商品编码
            Tid: item.tool_id,//工具id
          });
        }
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .rollNotice{
    padding: vw(16) 0;
    font-size: vw(26);
    color: #666;
    background: #fff;
    .wrap{
      display: flex;
      align-items: center;
      width: 92%;
      margin: 0 auto;
    }
    .overflowHidden{
      width: 100%;
    }
    .isLink{
      color: #4B8BEB;
    }
    img{
      width: vw(36);
      height: vw(30);
      margin-right: vw(10);
    }
  }

</style>
