<template>
  <div class="loanMarket">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 下拉刷新图片-->
      <div class="refreshImg" slot="pulling"><img src="../../assets/img/pullRefresh/refresh.png"/></div>
      <div class="refreshImg" slot="loading"><img src="../../assets/img/pullRefresh/refresh.gif"/></div>
      <div class="refreshImg" slot="loosing"><img src="../../assets/img/pullRefresh/refresh.png"/></div>
      <template v-for="(item, index) in templeteList">
        <!-- 轮播图片广告1 -->
        <img-swipe v-if="item.templet_type === 1" :imgList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></img-swipe>
        <!-- 跑马灯公告 -->
        <roll-notice v-if="item.templet_type === 4" :noticeList="item.templet || []" @jumpLink="jumpLink"></roll-notice>
        <!-- 资讯列表 -->
        <information v-if="item.templet_type === 9" :informationList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></information>
        <!-- 贷超列表 -->
        <loan-products v-if="item.templet_type === 6" :tabList="tabList" :loanProducts="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></loan-products>
        <!-- icon广告 -->
        <icon-ad v-if="item.templet_type === 5" :iconAdList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></icon-ad>
        <!-- 单图广告 -->
        <img-ad-one v-if="item.templet_type === 2" :imgList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></img-ad-one>
        <!-- 双图广告 -->
        <img-ad-two v-if="item.templet_type === 3" :imgList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></img-ad-two>
        <!-- 底部提示语 -->
        <bottom-tip v-if="item.templet_type === 8" :bottomTip="item.templet || []" @jumpLink="jumpLink"></bottom-tip>
      </template>
    </van-pull-refresh>
    <!-- 右侧角标 -->
    <buoy :buoy="buoy" @jumpLink="jumpLink"></buoy>
  </div>
</template>

<script>
  import { PullRefresh } from 'vant';// 下拉刷新
  import imgSwipe from 'components/module/imgSwipe';
  import rollNotice from 'components/module/rollNotice';
  import iconAd from 'components/module/iconAd';
  import imgAdOne from 'components/module/imgAdOne';
  import imgAdTwo from 'components/module/imgAdTwo';
  import bottomTip from 'components/module/bottomTip';
  import information from 'components/module/information';
  import loanProducts from 'components/module/loanProducts';
  import buoy from 'components/module/buoy';
  import { getUrlPara, alertMsg, nativeAppFun2, linkToLogin, userAgent, myAxios } from 'assets/js/utils';

  export default {
    name: 'loanMarket',
    components: {
      vanPullRefresh: PullRefresh,
      imgSwipe,
      rollNotice,
      iconAd,
      imgAdOne,
      imgAdTwo,
      bottomTip,
      information,
      loanProducts,
      buoy,
    },
    data(){
      return{
        pageTitle: getUrlPara('pageTitle'),//页面标题
        code: getUrlPara('code'),//贷超页面编码
        dcqdCode: getUrlPara('channel'),//贷超渠道编码
        isLoading: false,// 是否在加载中
        templeteList: [],// 模块化列表
        tabList: [],// 贷超tab
        buoy: [],// 右侧角标
      }
    },
    created(){
      window.onload = function() {
        //调用原生方法获取app参数
        nativeAppFun2("obtainHeader");
      }
      document.title = this.pageTitle;
      this.init();
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    beforeDestroy(){

    },
    methods:{
      onRefresh(){// 下拉刷新时触发
        let href = location.href;
        window.location.href = href.indexOf('?') > 0 ? href + "&timeStamp=" + (+new Date()) : href + "?timeStamp=" + (+new Date());
      },
      jumpLink(link, id, pointSubCode, obj, adType){//链接跳转
        // 资讯底层页链接
        let linkUrl = location.protocol + '//' + location.host + '/h5/informationDetail.html?contributionId=' + id;
        // 事件埋点
        obj = Object.assign({}, obj || {}, {
          // mobileNumber: window._dataFromApp.userName,//用户手机号
          url: link || (id ? linkUrl : "") || adType || "",// 跳转链接
          pageTitle: this.pageTitle,// 页面名称
          code: this.code,//贷超页面编码
          dcqdCode: this.dcqdCode//贷超渠道编码
        });
        h5EventBuryingPoints('mk', pointSubCode, obj);

        if(!link && !id && !adType) {
          return;
        }

        let json = {
          url: link || linkUrl,//加载url
        };
        if(!!link){
          nativeAppFun2('openNative',json);
        }else if(!!id){
          nativeAppFun2('openNative',json);
        }else if(!!adType){//跳转原生页面
          nativeAppFun2(adType);
        }
      },
      init(){// 初始化页面数据
        myAxios('/srApis/h5/pageTemlate', 'get', {
          code: this.code,
        }, (json) => {
          this.isLoading = false;
          this.initCallback(json);
        });
      },
      initCallback(json){//初始化回到函数
        if(json.code === 200) {
          let data = json.data;
          this.tabList = data.goods_tab || [];
          let templete_list = data.templete_list || [];
          let len = templete_list.length;
          this.templeteList = templete_list;
          // 获取右侧角标
          for(let i = 0; i < len; i ++) {
            if(templete_list[i].templet_type === 7) {
              this.buoy = templete_list[i].templet;
              templete_list.splice(i, 1);
              this.templeteList = templete_list;
              return;
            }
          }
        }else{
          alertMsg(json.message);
        }
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  body{
    background: rgb(242,242,242);
  }
  /* 下拉刷新图片 */
  .refreshImg {
    background: rgb(242,242,242);
    img {
      display: inline-block;
      width: 30px;
      margin: 0 auto;
    }
  }
  .loanMarket{
    position: relative;
    .marginTop10{
      margin-top: vw(10);
    }
  }
</style>
