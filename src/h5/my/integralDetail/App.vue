<template>
  <div class="integralDetail">
    <van-tabs :line-width="34" swipeable @click="tabChange">
      <van-tab v-for="(item, index) in tabList" :key="index" :title="item.tab_name">
        <ul>
          <li v-for="(item, index) in curList" :key="index">
            <div class="left">
              <p class="p1">{{item.name}}</p>
              <p class="p2">{{item.createTime}}</p>
            </div>
            <div class="right" v-if="curTab === '收入'">+{{item.integral}}</div>
            <div class="right" v-else>-{{item.integral}}</div>
          </li>
          <!--<li>-->
            <!--<div class="left">-->
              <!--<p class="p1">阅读资讯</p>-->
              <!--<p class="p2">2019-03-05</p>-->
            <!--</div>-->
            <!--<div class="right">+100</div>-->
          <!--</li>-->
        </ul>
      </van-tab>
    </van-tabs>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Tab, Tabs } from 'vant';
  Vue.use(Tab).use(Tabs);
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { alertMsg, myAxios } from 'assets/js/utils';
  export default {
    name: 'integralDetail',
    components: {
      vanTabs: Tabs,
      vanTab: Tab,
      vanLoading,
      loginInvalid
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        curTab: '收入',
        tabList:  [{
          "tab_id": 1,
          "tab_name": "收入"
        }, {
          "tab_id": 2,
          "tab_name": "支出"
        }],//tab
        incomeList: [],//收入
        payList: [],//支出
        curList: [],//当前显示列表
      }
    },
    created(){
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        if(!!window._dataFromApp.token) {
          this.init('income');
          this.init('pay');
        }
        window.myOnload();
      };
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    methods:{
      //初始化页面
      init(type) {
        myAxios('/srApis/h5/integral/detail', 'get', {
          token: window._dataFromApp.token || '',// 登录token
          type: type
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data;
            type === 'income' ? (this.incomeList = data) : (this.payList = data);
            this.curList = this.incomeList;
          }else{
            alertMsg(json.message);
          }
        });
      },
      tabChange(index, title){//tab标签改变时触发
        if(this.curTab !== title) {
          this.curList = title === '收入' ? this.incomeList : this.payList;
          this.curTab = title;
        }
      },
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  body{
    background: #f7f7f7;
  }
  .integralDetail{
    background: #fff;
    .van-tab{
      font-size: vw(32);
      color: #666;
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
    .van-tabs--line {
      padding-top: 50px;
    }
    .van-tabs--line .van-tabs__wrap {
      height: 50px;
    }
    .van-tab--active{
      color: #333;
      font-weight: 500;
    }
    .van-hairline--top-bottom::after{
      border-width: 1px 0;
    }
    li{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 vw(24);
      padding: vw(22) 0 vw(18);
      &:nth-of-type(n+2) {
        border-top: 1px solid #F2F4F5;
      }
      .p1{
        font-size: vw(28);
        color: #333;
      }
      .p2{
        margin-top: vw(4);
        font-size: vw(24);
        color: #999;
      }
      .right{
        font-size: vw(36);
        color: #FF4040;
      }
    }
  }
</style>
