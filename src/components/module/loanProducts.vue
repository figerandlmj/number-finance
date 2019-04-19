<template>
  <!-- 贷超列表 -->
  <div class="loanProducts" :ref="loanProductsRef">
    <van-tabs :class="{tabFixedTop: isTabFixedTop, tabFixedBottom: isTabFixedBottom}" :line-width="20" swipeable @click="tabChange">
      <van-tab v-for="(item, index) in tabList" :key="index" :title="item.tab_name">
        <div class="productsList">
          <ul>
            <li v-for="(liItem, liIndex) in curLoanProducts" :key="liIndex" @click="jumpLink(liItem)">
              <div class="detail">
                <div class="top">
                  <img :src="liItem.img_url" alt="" @error="imgError(liItem, 'small.png')">
                  <span class="title">{{liItem.title}}</span>
                  <span class="tag" v-if="liItem.extension_label" v-for="(tag, tagIndex) in liItem.extension_label.split(',')" :key="tagIndex">{{tag}}</span>
                </div>
                <div class="bottom" v-if="liItem.show_type === '小图标模板'">
                  <div class="left">
                    <div class="item1">
                      <p class="p1">{{liItem.max_money}}</p>
                      <p class="p2">预估额度（{{liItem.currency || '元'}}）</p>
                    </div>
                    <div class="item2">
                      <p class="p1">{{liItem.extension_title1}}</p>
                      <p class="p2">{{liItem.extension_title2}}</p>
                      <p class="p3">{{liItem.extension_title3}}</p>
                    </div>
                  </div>
                  <div class="right">立即申请</div>
                </div>
                <div class="bottom2" v-if="liItem.show_type === '大图标模板'">
                  <div>
                    <p class="p1 red">{{liItem.max_money}}</p>
                    <p class="p2">最高额度（{{liItem.currency || '元'}}）</p>
                  </div>
                  <div>
                    <p class="p1">{{liItem.long_cycle}}天</p>
                    <p class="p2">最长周期</p>
                  </div>
                  <div>
                    <p class="p1">{{liItem.min_interest}}%</p>
                    <p class="p2">最低利率</p>
                  </div>
                </div>
              </div>
              <img v-if="liItem.superscript_name" :src="liItem.superscript_name" alt="" class="mark">
            </li>
          </ul>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Tab, Tabs } from 'vant';
  import { throttle } from 'assets/js/utils';
  Vue.use(Tab).use(Tabs);
  export default {
    name: 'loanProducts',
    components: {
      vanTabs: Tabs,
      vanTab: Tab
    },
    props: {
      tabList: {
        type: Array,
        required: true
      },
      loanProducts: {
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
        curLoanProducts: this.loanProducts[0].goods || [],
        curTab: this.tabList[0].tab_name,
        isTabFixedTop: false, //tab是否粘顶
        isTabFixedBottom: false,//tab是否粘底
        loanProductsRef: 'loanProducts'
      }
    },
    created(){
    },
    mounted() {
      this.loanProductsRef += this.templateIndex;
      window.addEventListener('scroll', throttle(this.handleScroll, 10));
    },
    methods:{
      //页面滚动事件
      handleScroll(){
        this.$emit('preventRefresh', true);
        let windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let eleOffsetTop = this.$refs[this.loanProductsRef].offsetTop;
        let eleOffsetHeight = this.$refs[this.loanProductsRef].offsetHeight;
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
          this.curLoanProducts = this.loanProducts[index].goods || [];
          this.curTab = title;
        }
      },
      jumpLink(item){
        this.$emit('jumpLink', item.link, "", 'click_mk_sp', {
          pdName: item.title,
          tabName: this.curTab,
          Pid: item.super_id, //商品id
        });
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .loanProducts{
    .van-tab{
      font-size: vw(28);
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
    .productsList{
      background: #fff;
      li{
        position: relative;
        padding: vw(30) vw(26);
        &:nth-of-type(n+2){
          border-top: 1px solid #F2F4F5;
        }
      }
      .mark{
        position: absolute;
        top: 0;
        right: 0;
        width: vw(118);
        height: vw(118);
      }
      .top{
        display: flex;
        align-items: center;
        padding-bottom: vw(30);
        img{
          width: vw(60);
        }
        .title{
          margin: 0 vw(10) 0 vw(10);
          font-size: vw(34);
          color: #333;
        }
        .tag{
          padding: 2px vw(10);
          font-size: vw(22);
          border-radius: vw(20);
          &:nth-of-type(2n+1){
            color: #F69A01;
            border: 1px solid #F69A01;
          }
          &:nth-of-type(2n){
            color: #2BADF0;
            border: 1px solid #2BADF0;
          }
          &:nth-of-type(n+1){
            margin-left: vw(14);
          }
        }
      }
      .bottom{
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
      }
      .left{
        display: flex;
        font-size: vw(24);
        color: #666;
      }
      .item1{
        padding-right: vw(20);
        border-right: 1px solid #f2f2f2;
        p{
          text-align: center;
        }
        .p1{
          margin-bottom: vw(10);
          font-size: vw(44);
          color: #FF211F;
        }
      }
      .item2{
        padding-left: vw(30);
        p{
          text-align: left;
        }
        .p2{
          margin: vw(10) 0;
        }
      }
      .right{
        font-size: vw(26);
        color: #333;
        font-weight: 600;
        padding: vw(12) vw(24);
        border-radius: vw(32);
        background: #FFD93B;
      }
      .bottom2{
        display: flex;
        border-top: 1px dashed #f2f2f2;
        padding-top: vw(20);
        > div{
          flex: 1;
          text-align: center;
        }
        .p1{
          margin-bottom: vw(6);
          font-size: vw(36);
          color: #333;
        }
        .p2{
          font-size: vw(24);
          color: #9B9B9B;
        }
        .red{
          color: #FD4014;
        }
      }
    }
  }

</style>
