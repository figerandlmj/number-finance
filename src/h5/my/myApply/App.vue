<template>
  <div class="myApply">
    <div class="noData" v-if="count === 0 && historyCount === 0">
      <img src="../../../assets/img/noData.png" alt="">
      <p>暂无内容~</p>
    </div>
    <template v-if="count > 0 || historyCount > 0">
      <div class="top">
        <span class="applyBtn active" v-if="applyList.length >= productCount" @click="applyReward">领取</span>
        <span class="applyBtn" v-else>领取</span>
        <p>申请{{productCount || 'N'}}款产品即可参加活动</p>
      </div>
      <ul class="applyList">
        <li v-for="(item, index) in applyList" :key="index">
          <div class="nameWrap">
            <img :src="item.pPic" alt="">
            <p class="name">{{item.pName}}</p>
          </div>
          <div class="detailWrap">
            <div class="platform">
              <p class="title">有效平台</p>
              <p class="p2">{{item.pName}}</p>
            </div>
            <div class="termOfValidity">
              <p class="title">有效期</p>
              <p class="p2">{{item.termOfValidity}}天</p>
            </div>
            <div class="reward">
              <p class="title"><span>可获奖励</span></p>
              <p class="p2">{{item.reward.toFixed(2)}}元</p>
            </div>
          </div>
          <div class="dateWrap">
            <span>申请日期 <br>{{item.applyTime}}</span>
            <span class="orderNo">订单编号 <br>{{item.orderNo}}</span>
          </div>
          <img src="./img/status1.png" alt="" class="status">
          <div class="semiCircle">
            <span class="left"></span>
            <span class="right"></span>
          </div>
        </li>
      </ul>
      <div class="historyWrap" v-if="historyApplyList.length > 0">
        <div class="topTitle">
          <p>历史申请</p>
          <div class="openWrap" @click="open">
            <template v-if="!isOpen">
              <span>展开</span>
              <img src="./img/down.png" alt="">
            </template>
            <template v-else>
              <span>收起</span>
              <img src="./img/up.png" alt="">
            </template>
          </div>
        </div>
        <ul class="applyList" v-show="isOpen">
          <li v-for="(item, index) in historyApplyList" :key="index">
            <div class="nameWrap">
              <div class="imgMask"></div>
              <img :src="item.pPic" alt="">
              <p class="name">{{item.pName}}</p>
            </div>
            <div class="detailWrap">
              <div class="platform">
                <p class="title">有效平台</p>
                <p class="p2">{{item.pName}}</p>
              </div>
              <div class="termOfValidity">
                <p class="title">有效期</p>
                <p class="p2">{{item.termOfValidity}}天</p>
              </div>
              <div class="reward">
                <p class="title"><span>可获奖励</span></p>
                <p class="p2">{{item.reward.toFixed(2)}}元</p>
              </div>
            </div>
            <div class="dateWrap">
              <span>申请日期 <br>{{item.applyTime}}</span>
              <span class="orderNo">订单编号 <br>{{item.orderNo}}</span>
            </div>
            <img src="./img/status2.png" alt="" class="status" v-if="item.status === 2">
            <img src="./img/status3.png" alt="" class="status" v-if="item.status === 3">
            <div class="semiCircle">
              <span class="left"></span>
              <span class="right"></span>
            </div>
          </li>
          <p class="noData" v-if="historyCount === 0">暂无内容~</p>
        </ul>
      </div>
    </template>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { alertMsg, myAxios } from 'assets/js/utils';
  export default {
    name: 'myApply',
    components: {
      vanLoading,
      loginInvalid
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        productCount: 'N',//可领取数量
        isOpen: false,//是否展开
        applyList: [],//记录列表
        count: '',//记录列表总条数
        historyApplyList: [],//历史记录列表
        pageNo: 1,//页面（历史记录）
        haveNextPage: false,//历史记录是否有下一页
        historyCount: '',//历史记录列表总条数
      }
    },
    created(){
      // this.init(1);
      // this.init(2);
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        if(!!window._dataFromApp.token) {
          this.init(1);
          this.init(2);
        }
        window.myOnload();
      };
      //窗口滚动监听事件
      $(window).scroll(() => {
        let scrollTop = $(window).scrollTop();//滚动条在Y轴上的滚动距离
        let clientHeight = $(window).height();//内容可视区域的高度
        let scrollHeight = $(document).height();//内容可视区域的高度加上溢出（滚动）的距离
        if(this.haveNextPage && (scrollTop + clientHeight) >= scrollHeight) {
          this.pageNo ++;
          this.init(2);
        }
      })
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    methods:{
      //初始化页面
      init(status) {
        myAxios('/srApis/apis/unionLoadProduct/select', 'post', {
          pageNo: status === 1 ? 1 : this.pageNo,
          pageSize: 20,
          status: status,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data;
            if(status === 1) {
              this.productCount = data.productCount;
              this.applyList = data.result || [];
              this.count = data.count;
            }else if(status === 2) {
              this.historyApplyList = [...this.historyApplyList, ...data.result];
              this.haveNextPage = data.haveNextPage;
              this.historyCount = data.count;
            }
          }else{
            alertMsg(json.message);
          }
        });
      },
      //展开or收起历史记录
      open() {
        this.isOpen = !this.isOpen;
      },
      //领取奖励
      applyReward() {
        this.showVanLoading = true;
        myAxios('/srApis/apis/unionLoadProduct/apply', 'post', {
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          // 事件埋点
          h5EventBuryingPoints('wdsq', 'click_wdsq_lq', {
            Result: json.code === 200 ? 'success' : 'fail'
          });
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            alertMsg('领取成功');
            setTimeout(() => {
              location.reload();
            }, 1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
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
  .noData{
    padding-top: vw(140);
    font-size: vw(30);
    color: #999;
    text-align: center;
    img{
      width: vw(750);
      height: vw(647);
      margin: 0 auto vw(10);
    }
  }
  .top{
    display: flex;
    align-items: center;
    width: 100%;
    height: vw(100);
    padding: 0 vw(24);
    background: #fff;
    .applyBtn{
      width: vw(134);
      height: vw(56);
      line-height: vw(56);
      font-size: vw(26);
      color: #BABABA;
      text-align: center;
      background: #E5E5E5;
      border-radius: vw(33);
    }
    .active{
      color: #333;
      background: #FFD93B;
    }
    p{
      margin-left: vw(24);
      font-size: vw(28);
      color: #888;
    }
  }
  .applyList{
    padding: 0 vw(24);
    margin-top: vw(10);
    margin-bottom: vw(56);
    li{
      position: relative;
      padding: vw(34) vw(18) 0 vw(30);
      margin-top: vw(24);
      background: #fff;
      border-radius: 5px;
    }
    .nameWrap{
      display: flex;
      align-items: center;
      img{
        width: vw(60);
        height: vw(60);
        border-radius: 50%;
      }
      p{
        margin-left: vw(24);
        font-size: vw(30);
        color: #555;
      }
    }
    .detailWrap{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: vw(24) 0 vw(28);
      border-bottom: 1px dashed #E8E8E8;
      .title{
        font-size: vw(24);
        color: #AEAEAE;
      }
      p{
        text-align: center;
      }
      .p2{
        margin-top: vw(16);
        font-size: vw(32);
        color: #333;
        font-weight: 500;
      }
      .reward{
        width: 56px;
        .title{
          position: relative;
          color: #666;
          span{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
          }
        }
        .p2{
          margin-top: vw(47);
          color: #FD1414;
        }
      }
    }
    .dateWrap{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: vw(18) vw(20) vw(20);
      font-size: vw(24);
      color: #999;
      .orderNo{
        margin-left: vw(12);
      }
    }
    .status{
      position: absolute;
      top: vw(18);
      right: vw(18);
      width: vw(132);
      height: vw(132);
    }
    .semiCircle{
      span{
        position: absolute;
        bottom: vw(75);
        display: block;
        width: 10px;
        height: 20px;
        background-color: rgb(242,242,242);
      }
      .left{
        left: 0;
        border-radius: 0 10px 10px 0;
      }
      .right{
        right: 0;
        border-radius: 10px 0 0 10px;
      }
    }
  }
  .historyWrap{
    padding: 0 vw(24);
    background: #fff;
    border-top: 1px solid #eee;
    .noData{
      padding-top: 0;
    }
    .topTitle{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: vw(28) 0;
      p{
        font-size: vw(40);
        color: #333;
      }
      .openWrap{
        display: flex;
        align-items: center;
        font-size: vw(28);
        color: #666;
        img{
          width: vw(26);
          height: vw(14);
          margin-left: vw(16);
        }
      }
    }
    .applyList{
      padding: 0 0 vw(50);
      margin-bottom: 0;
      li{
        background: #F2F2F2;
      }
      .nameWrap{
        position: relative;
        .imgMask{
          position: absolute;
          top: 0;
          left: 0;
          width: vw(60);
          height: vw(60);
          border-radius: 50%;
          background:rgba(216,216,216,.5);
        }
      }
      .detailWrap{
        border-bottom: 1px dashed #DCDCDC;
        .p2{
          color: #888;
        }
      }
      .semiCircle{
        span{
          background: #fff;
        }
      }
    }
  }
</style>
