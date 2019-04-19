<template>
  <!-- 联登商品 -->
  <div class="unionProducts">
    <div class="top">
      <div class="title">合作方专区</div>
      <div class="record" v-if="agent === 'pgy_shurong' && isShowMyApply" @click="linkRecord">申请记录</div>
    </div>
    <ul class="products">
      <li v-for="(item, index) in productList" :key="index">
        <div class="left">
          <img :src="item.productPic" alt="" @error="imgError(item, 'small.png')">
          <div class="detail">
            <p class="p1">{{item.productName}}</p>
            <p class="p2">{{item.title}}</p>
            <p class="p3"><span>{{item.minQuota}}-{{item.maxQuota}}</span>{{item.minTerm}}-{{item.maxTerm}}天</p>
          </div>
        </div>
        <div class="right">
          <p><span>{{(item.count >= 10000 ? ((item.count / 10000).toFixed(1) > 99.9 ? (99.9 + '万') : (item.count / 10000).toFixed(1) + "万") : item.count) || 0}}人</span>已申请</p>
          <div class="btn active" v-if="item.status === 1" @click="jumpLink(item)">立即申请</div>
          <div class="btn" v-else>无法申请</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'unionProducts',
    props: {
      productList: {
        type: Array,
        required: true
      },
      agent: {
        type: String,
        required: true
      },
      isShowMyApply: {
        type: Boolean,
        required: true
      }
    },
    data(){
      return{

      }
    },
    created(){
    },
    mounted() {
    },
    methods:{
      imgError(item, imgName) {//图片加载失败显示默认图
        item.productPic = require('../../assets/img/'+ imgName);
      },
      jumpLink(item){
        this.$emit('unionJumpLink', item);
      },
      //跳转申请记录
      linkRecord() {
        this.$emit('linkRecord');
      },
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  .unionProducts{
    padding: 0 vw(24);
    .top{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 5px;
      .title{
        font-size: vw(36);
        color: #333;
        font-weight: bold;
      }
      .record{
        font-size: vw(26);
        color: #888;
      }
    }
    .products{
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: vw(20);
        padding: vw(30) vw(24);
        background: #fff;
        border-radius: 3px;
        box-shadow: -4px 4px 22px 0px rgba(228,228,228,0.5);
      }
      .left{
        display: flex;
        align-items: center;
      }
      img{
        width: vw(88);
        height: vw(88);
        border-radius: 50%;
      }
      .detail{
        margin-left: vw(24);
        .p1{
          font-size: vw(30);
          color: #333;
          font-weight: 500;
        }
        .p2{
          margin: vw(6) 0 vw(12);
          font-size: vw(26);
          color: #666;
        }
        .p3{
          font-size: vw(32);
          color: #666;
          font-weight: 500;
          span{
            color: #FF211F;
            &::after{
              content: '';
              display: inline-block;
              width: 2px;
              height: vw(24);
              margin: 0 vw(12);
              background: #BDBDBD;
            }
          }
        }
      }
      .right{
        p{
          font-size: vw(24);
          /*color: #E4E4E4;*/
          color: #666;
          text-align: right;
          span{
            color: #666;
          }
        }
        .btn{
          margin-top: vw(38);
          padding: vw(12) vw(24);
          font-size: vw(26);
          color: #BABABA;
          font-weight: 600;
          border-radius: vw(32);
          background: #E5E5E5;
        }
        .active{
          color: #333;
          background: #FFD93B;
        }
      }
    }
  }
</style>
