<template>
  <div class="index">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 下拉刷新图片-->
      <div class="refreshImg" slot="pulling"><img src="../../../assets/img/pullRefresh/refresh.png"/></div>
      <div class="refreshImg" slot="loading"><img src="../../../assets/img/pullRefresh/refresh.gif"/></div>
      <div class="refreshImg" slot="loosing"><img src="../../../assets/img/pullRefresh/refresh.png"/></div>
      <div class="top">
        <div class="title">
          <span>账户总额(元）</span>
          <img v-if="isLogin && isShowTotal && total > 0" src="./img/open.png" alt="" class="open" @click="openOrOff(false)">
          <img v-else src="./img/off.png" alt="" class="off" @click="openOrOff(true)">
        </div>
        <div class="total">
          <span v-if="isLogin && isShowTotal && total > 0">{{totalAmount}}</span>
          <span v-else-if="!isLogin" class="login" @click="toLogin">登录查看</span>
          <span v-else>*****</span>
        </div>
      </div>
      <div class="main">
        <div class="listWrap" v-if="isLogin && total">
          <div class="title">借款/贷款(元)</div>
          <ul>
            <li @click="linkToRecordDetail(item.id)" v-for="(item, index) in borrowsList" :key="index">
              <div class="left">
                <p class="p1">-{{item.borrowAmount}}</p>
                <p class="p2">{{item.borrowName}}</p>
              </div>
              <div class="right">{{item.nper}}期</div>
            </li>
            <!--<li>-->
              <!--<div class="left">-->
                <!--<p class="p1">-2500.00</p>-->
                <!--<p class="p2">人人贷</p>-->
              <!--</div>-->
              <!--<div class="right">24期</div>-->
            <!--</li>-->
          </ul>
        </div>
        <div class="noData" v-if="isLogin && !total">
          <img src="./img/noData.png" alt="">
          <p>暂无数据～</p>
        </div>
        <div class="noData noData2" v-if="!isLogin">
          <img src="./img/record.png" alt="">
          <p>每一笔账单<br>都是生活的点点滴</p>
        </div>
      </div>
    </van-pull-refresh>
    <div class="submitBtn" @click="linkToRecord">记一笔</div>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  import { PullRefresh} from 'vant';// 下拉刷新
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { alertMsg, linkToLogin, nativeAppFun, myAxios } from 'assets/js/utils';
  export default {
    name: 'index',
    components: {
      vanLoading,
      vanPullRefresh: PullRefresh,
      loginInvalid
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        isLoading: false,// 是否在加载中
        isLogin: true,//是否登录
        isShowTotal: true,//是否显示账单总额
        total: 100,//记录总条数
        hasNextPage: true,//是否有下一页
        totalAmount: "0.00",//账单总额
        borrowsList: [],//借款列表
      }
    },
    created(){
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        if(window._dataFromApp.token) {
          this.isLogin = true;
          this.init();
        }else{
          this.isLogin = false;
        }
        window.myOnload();
      };
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    methods:{
      onRefresh(){// 下拉刷新时触发
        let href = location.href;
        window.location.href = href.indexOf('?') > 0 ? href + "&timeStamp=" + (+new Date()) : href + "?timeStamp=" + (+new Date());
      },
      // 页面初始化
      init(){
        myAxios('/srApp/h5/jz/index', 'get', {
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data;
            let paging = data.paging || {};
            this.total = paging.total || 0;
            this.hasNextPage = paging.hasNextPage || false;
            this.borrowsList = data.borrows || [];
          }else{
            alertMsg(json.message);
          }
        });
      },
      //账单总额脱敏处理
      openOrOff(flag) {
        if(this.total) {
          flag ? this.isShowTotal = true : this.isShowTotal = false;
        }
      },
      //跳转登录
      toLogin() {
        linkToLogin();
      },
      //跳转新增账单
      linkToRecord() {
        // if(linkToLogin()) {
          nativeAppFun('SR_H5Page',{
            url: location.protocol + '//' + location.host + '/h5/accountingAssistant/record.html'
          });
        // }
      },
      //跳转账单详情
      linkToRecordDetail(id) {
        // if(linkToLogin()) {
          nativeAppFun('SR_H5Page',{
            url: location.protocol + '//' + location.host + '/h5/accountingAssistant/recordDetail.html?id=' + id
          });
        // }
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  body{
    background: #FAFAFA;
  }
  .van-pull-refresh{
    overflow: initial;
  }
  /* 下拉刷新图片 */
  .refreshImg {
    background: #FAFAFA;
    img {
      display: inline-block;
      width: 30px;
      margin: 0 auto;
    }
  }
  .index{
    .top{
      position: absolute;
      top: vw(-120);
      width: 100%;
      height: vw(320);
      padding: 0 vw(24);
      background: url('./img/topBg.png') no-repeat center;
      background-size: 100% vw(320);
      .title{
        padding-top: vw(168);
        display: flex;
        align-items: center;
        span{
          margin-right: vw(8);
          font-size:vw(26);
          color: #4A4A4A;
        }
        .open{
          width: vw(28);
          height: vw(20);
        }
        .off{
          width: vw(28);
          height: vw(14);
        }
      }
      .total{
        font-size: vw(60);
        color: #333;
        font-weight: 500;
        .login{
          font-size: vw(44);
        }
      }
    }
    .main{
      position: absolute;
      top: vw(200);
      width: 100%;
    }
    .listWrap{
      margin-bottom: vw(120);
      background: #fff;
      .title{
        padding: vw(24);
        font-size: vw(24);
        color: #888;
      }
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: vw(20) vw(24) vw(20) 0;
        margin-left: vw(24);
        border-top: 1px solid #F0F0F0;
        .p1{
          font-size: vw(32);
          color: #FF4040;
        }
        .p2{
          margin-top: vw(6);
          font-size: vw(24);
          color: #999;
        }
        .right{
          font-size: vw(28);
          color: #4A4A4A;
        }
      }
    }
    .noData{
      img{
        width: vw(218);
        height: vw(250);
        margin: vw(162) auto 0;
      }
      p{
        margin-top: vw(32);
        font-size: vw(26);
        color: #999;
        text-align: center;
      }
    }
    .noData2{
      img{
        width: vw(280);
        height: vw(182);
      }
      p{
        line-height: vw(40);
      }
    }
    .submitBtn{
      position: fixed;
      bottom: 0;
      width: 100%;
      height: vw(100);
      line-height: vw(100);
      font-size:vw(32);
      color: #4A4A4A;
      font-weight:500;
      text-align: center;
      background: #FFD93B;
    }
  }

</style>
