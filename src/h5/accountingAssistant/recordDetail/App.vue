<template>
  <div class="recordDetail">
    <div class="top">
      <p class="p1">帐户总额(元)</p>
      <p class="p2">{{borrowAmount}}</p>
    </div>
    <ul class="listWrap">
      <li v-for="(item, index) in infoList" :key="index">
        <div class="left">
          <span>{{item.nperTimes}}</span>{{item.nperAmount}}元
        </div>
        <div class="right">
          <span>还款日期</span>{{item.borrowCreate}}
        </div>
      </li>
      <!--<li>-->
        <!--<div class="left">-->
          <!--<span>1期</span>500.00元-->
        <!--</div>-->
        <!--<div class="right">-->
          <!--<span>还款日期</span>2018-11-15-->
        <!--</div>-->
      <!--</li>-->
    </ul>
    <div class="deleteWrap" @click="isShowPopup = true">
      <img src="./img/delete.png" alt="">
      <span>删除该账单</span>
    </div>
    <div class="bottom">
      <div class="tipBtn" @click="linkToRepayTip">提醒</div>
      <div class="recordBtn" @click="linkToRecord">记一笔</div>
    </div>
    <!-- 是否删除账单弹框 -->
    <van-popup v-model="isShowPopup" position="bottom" class="popupBox">
      <div class="title">删除当前账单并取消还款提醒</div>
      <ul>
        <li class="active" @click="deleteRecord">确定</li>
        <li @click="isShowPopup = false">取消</li>
      </ul>
    </van-popup>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  import { Popup } from 'vant';
  import Vue from 'vue';
  Vue.use(Popup);
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { alertMsg, linkToLogin, nativeAppFun, myAxios, getUrlPara } from 'assets/js/utils';
  export default {
    name: 'recordDetail',
    components: {
      vanLoading,
      loginInvalid,
      vanPopup: Popup,
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        isLoading: false,// 是否在加载中
        isShowPopup: false,//是否显示删除账单弹框
        id: getUrlPara('id'),//账单id
        borrowAmount: "0.00",//借款总额
        infoList: [],//详情列表
      }
    },
    created(){
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        if(window._dataFromApp.token) {
          this.init();
        }
        window.myOnload();
      };
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    methods:{
      // 页面初始化
      init(){
        myAxios('/srApp/h5/jz/detail', 'get', {
          id: this.id,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data || {};
            this.borrowAmount = data.borrowAmount || '0.00';
            this.infoList = data.details || [];
          }else{
            alertMsg(json.message);
          }
        });
      },
      //删除该账单
      deleteRecord(){
        this.showVanLoading = true;
        myAxios('/srApp/h5/jz/delete', 'get', {
          id: this.id,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            alertMsg('删除成功');
            this.isShowPopup = false;
            setTimeout(() => {
              nativeAppFun('SR_Event_Back', "", "callBackFresh");//返回
            }, 1500);
          }else{
            alertMsg(json.message);
          }
        });

      },
      //跳转新增账单
        linkToRecord() {
        // if(linkToLogin()) {
        nativeAppFun('SR_H5Page',{
          url: location.protocol + '//' + location.host + '/h5/accountingAssistant/record.html'
        });
        // }
      },
      //跳转还款提醒
      linkToRepayTip() {
        // if(linkToLogin()) {
        nativeAppFun('SR_H5Page',{
          url: location.protocol + '//' + location.host + '/h5/accountingAssistant/repayTip.html?id=' + this.id
        });
        // }
      },
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
  .recordDetail{
    .top{
      padding: vw(38) 0 vw(28);
      background: #fff;
      text-align: center;
      .p1{
        font-size: vw(24);
        color: #999;
      }
      .p2{
        font-size: vw(52);
        color: #FF4040;
      }
    }
    .listWrap{
      margin-top: vw(20);
      background: #fff;
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: vw(38) vw(24) vw(38) 0;
        margin-left: vw(24);
        &:nth-of-type(n + 2) {
          border-top: 1px solid #F0F0F0;
        }
        .left{
          font-size: vw(32);
          color: #333;
          span{
            padding-right: vw(18);
            font-size: vw(28);
            color: #999;
          }
        }
        .right{
          font-size: vw(24);
          color: #BCBCBC;
          span{
            color: #BCBCBC;
          }
        }
      }
    }
    .deleteWrap{
      margin: vw(30) auto vw(146);
      font-size: vw(26);
      color: #469BFF;
      text-align: center;
      img{
        position: relative;
        top: vw(2);
        right: vw(6);
        display: inline-block;
        width: vw(24);
        height: vw(28);
      }
    }
    .bottom{
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: vw(100);
      text-align: center;
      line-height: vw(100);
      font-size: vw(32);
      font-weight:500;
      .tipBtn{
        width: vw(200);
        color: #fff;
        background: #333;
      }
      .recordBtn{
        flex: 1;
        color: #4A4A4A;
        background: #FFD93B;
      }
    }
    .popupBox{
      .title{
        padding: vw(40) 0;
        font-size: vw(26);
        color: #999;
        text-align: center;
      }
      li{
        padding: vw(32) 0;
        text-align: center;
        font-size: vw(30);
        color: #4A4A4A;
        border-top: 1px solid #F0F0F0;
        &.active{
          color: #FD4014;
        }
      }
    }
  }
</style>
