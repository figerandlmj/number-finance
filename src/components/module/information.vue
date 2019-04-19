<template>
  <!-- 资讯列表 -->
  <div class="information" :ref="informationRef">
    <van-tabs :class="{tabFixedTop: isTabFixedTop, tabFixedBottom: isTabFixedBottom}" :line-width="20" swipeable @click="tabChange">
      <van-tab v-for="(item, index) in tabList" :key="index" :title="item.tabName">
        <div class="informationList">
          <ul>
            <li v-for="(liItem, liIndex) in curInformationList" :key="liIndex" @click="jumpLink(liItem)">
              <img :src="liItem.img_url" alt="" @error="imgError(liItem, 'small.png')">
              <div class="detail">
                <p class="title">{{liItem.title}}</p>
                <p class="source" v-if="liItem.contribution_source">{{liItem.contribution_source}}</p>
              </div>
            </li>
          </ul>
          <div class="loadMore" v-show="curTabIsNextPage" @click="loadMore">加载更多</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Tab, Tabs } from 'vant';
  import { throttle, alertMsg, myAxios } from 'assets/js/utils';
  Vue.use(Tab).use(Tabs);
  export default {
    name: 'information',
    components: {
      vanTabs: Tabs,
      vanTab: Tab
    },
    props: {
      tabList: {
        type: Array,
        required: true
      },
      informationList: {
        type: Array,
        required: true
      },
      templateIndex: {
        type: Number,
        required: true
      }
    },
    data(){
      return{
        curInformationList: this.informationList[0].charts || [],
        curTabIsNextPage: this.informationList[0].nextPage || false,//当前tab下是否有下一页
        curPage: this.informationList[0].currentPage,//当前tab的页码
        curTab: this.tabList[0].tabName,
        curTabId: this.tabList[0].tabId,
        curIndex: 0,
        isTabFixedTop: false, //tab是否粘顶
        isTabFixedBottom: false,//tab是否粘底
        informationRef: 'information'
      }
    },
    mounted() {
      this.informationRef += this.templateIndex;
      window.addEventListener('scroll', throttle(this.handleScroll, 10));
    },
    methods:{
      //页面滚动事件
      handleScroll(){
        this.$emit('preventRefresh', true);
        let windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let eleOffsetTop = this.$refs[this.informationRef].offsetTop;
        let eleOffsetHeight = this.$refs[this.informationRef].offsetHeight;
        if(windowScrollTop > eleOffsetTop && windowScrollTop < (eleOffsetTop + eleOffsetHeight - 50)) {
          this.isTabFixedTop = true;
          this.isTabFixedBottom = false;
        }else{
          this.isTabFixedTop = false;
          if(windowScrollTop > (eleOffsetTop + eleOffsetHeight - 50)) {
            this.isTabFixedBottom = true;
          }else{
            this.isTabFixedBottom = false;
          }
        }
        if(windowScrollTop === 0) {
          this.$emit('preventRefresh', false);
        }
      },
      imgError(item, imgName) {//图片加载失败显示默认图
        item.img_url = require('../../assets/img/'+ imgName);
      },
      tabChange(index, title){//tab标签改变时触发
        if(this.curTab !== title) {
          this.curInformationList = this.informationList[index].charts || [];
          this.curTabIsNextPage = this.informationList[index].nextPage || false;
          this.curPage = this.informationList[index].currentPage;
          this.curTabId = this.tabList[index].tabId;
          this.curTab = title;
          this.curIndex = index;
        }
      },
      jumpLink(item){
        this.$emit('jumpLink', item.link, item.contribution_id, 'click_mk_tw', {
          picTitle: item.title,
          contributionId: item.contribution_id || '',//稿件id
          Pid: item.daichaoId || "", //商品编码
          Tid: item.tool_id,//工具id
        });
      },
      //加载更多
      loadMore() {
        this.$emit('isShowVanLoading', true);
        this.curPage ++;
        myAxios('/srApis/h5/chart/getMoreByTabId', 'get', {
          tabId: this.curTabId,
          currentPage: this.curPage,
        }, (json) => {
          this.$emit('isShowVanLoading', false);
          if(json.code === 200) {
            let data = json.data || {};
            let dataArr = data.data || [];
            let nextPage = data.nextPage || false;
            this.informationList[this.curIndex].nextPage = nextPage;
            this.informationList[this.curIndex].charts = [...this.informationList[this.curIndex].charts, ...dataArr];
            this.informationList[this.curIndex].currentPage = data.currentPage;
          }else{
            alertMsg(json.message);
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .information{
    background: #fff;
    .van-tab{
      font-size: vw(28);
      /*color: #333;*/
      line-height: 50px;
      &:active{
        background-color: transparent;
      }
      span::after{
        content: "";
        position: absolute;
        top: 50%;
        right: 0;
        height: 40px;
        margin-top: -20px;
        transform: scale(.5);
        /*border-right: 1px solid #e5e5e5;*/
      }
    }
    .van-tabs__line{
      height: 3px;
      background-color: #FFD93B;
    }
    .van-tabs--line .van-tabs__wrap {
      height: 50px;
    }
    .van-tab--active{
      /*color: #FFA531;*/
      color: #333;
      font-size: vw(32);
      font-weight: 500;
    }
    .van-hairline--top-bottom::after{
      border-width: 1px 0;
    }
    .tabFixedTop{
      .van-tabs__wrap {
        position: fixed;
        top: 0;
      }
    }
    .tabFixedBottom{
      .van-tabs__wrap {
        position: absolute;
        top: auto;
        bottom: 0;
      }
    }
    .informationList{
      ul{
        width: 92%;
        margin: 0 auto;
      }
      li{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: vw(24) 0;
        &:nth-of-type(n+2){
          border-top: 1px solid #f2f2f2;
        }
        img{
          width: vw(224);
          height: vw(150);
          margin-right: vw(28);
          border-radius: vw(4);

        }
        .detail{
          flex: 1;
        }
        .title{
          font-size: vw(32);
          color: #333;
        }
        .source{
          margin-top: vw(18);
          font-size: vw(24);
          color: #999;
        }
      }
      .loadMore{
        padding: vw(20) 0;
        font-size: vw(28);
        color: #888;
        text-align: center;
        background: #f7f7f7;
      }
    }
  }
</style>
