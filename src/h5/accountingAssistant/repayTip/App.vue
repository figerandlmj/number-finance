<template>
  <div class="repayTip">
    <div class="top">
      <span>提醒</span>
      <img src="./img/tipOpen.png" alt="" class="tipBtn" v-if="tipOpen" @click="setIsTip(false)">
      <img src="./img/tipOff.png" alt="" class="tipBtn" v-else @click="setIsTip(true)">
    </div>
    <ul class="listWrap" v-show="tipOpen">
      <li class="title">
        <span>期数</span>
        <span>提醒时间</span>
      </li>
      <li v-for="(item, index) in tipData" :key="index">
        <span>{{item.nperTimes}}</span>
        <div class="right" @click="settingTipTime(item.detailId, item.remindDate, item.borrowCreate)">
          <span>{{item.remindDate}}</span>
          <img src="./img/arrow.png" alt="">
        </div>
      </li>
      <!--<li>-->
        <!--<span>2期</span>-->
        <!--<div class="right" @click="settingTipTime('2019-06-10 12:00')">-->
          <!--<span>2019-06-10 12:00</span>-->
          <!--<img src="./img/arrow.png" alt="">-->
        <!--</div>-->
      <!--</li>-->
    </ul>
    <!-- 日期选择弹框 -->
    <van-popup v-model="isShowDatePopup" position="bottom" class="datePopupBox">
      <van-datetime-picker
        v-model="selectDate"
        type="datetime"
        title="设置提醒时间"
        :min-date="minDate"
        :max-date="maxDate"
        @change="dateChange"
        @confirm="dateConfirm"
        @cancel="dateCancel"
      />
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
  import { DatetimePicker } from 'vant';
  Vue.use(DatetimePicker);
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { alertMsg, linkToLogin, nativeAppFun, myAxios, getUrlPara, getSystemTime } from 'assets/js/utils';
  export default {
    name: 'repayTip',
    components: {
      vanLoading,
      loginInvalid,
      vanPopup: Popup,
      vanDatetimePicker: DatetimePicker,

    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        id: getUrlPara('id'),//账单id
        // tipData: [],//提醒日期数据
        tipData: [{
          nperTimes: '1期',
          remindDate: '2019-04-18 10:00',
        },{
          nperTimes: '2期',
          remindDate: '2019-05-09 04:00',
        },{
          nperTimes: '3期',
          remindDate: '2020-01-03 23:00',
        }],
        tipOpen: false,//是否开启到期日还款提醒
        isShowDatePopup: false,//是否显示日期选择弹框
        selectTime: + new Date(),//当前选中时间
        selectDate: new Date(),//当前选中日期
        minDate: new Date(),
        maxDate: new Date(new Date().getFullYear() + 1, 0, 1),
        detailId: '',//当前被设置期数id
      }
    },
    created(){
      this.setDatePopup();
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        if(window._dataFromApp.token) {
          this.init();
        }
        this.selectTime = getSystemTime();
        this.setDatePopup();
        window.myOnload();
      };
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    methods: {
      init(){
        myAxios('/srApp/h5/jz/detail', 'get', {
          id: this.id,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            let data = json.data || {};
            this.tipData = data.details || [];
            this.tipOpen = data.isRemind || false;
          }else{
            alertMsg(json.message);
          }
        });
      },
      //提醒日期选择弹框
      setDatePopup() {
        this.selectDate = new Date(this.selectTime);
        this.minDate = this.selectDate;
        this.maxDate = new Date(new Date(this.selectTime).getFullYear() + 1, 0, 1);
      },
      dateChange(picker) {
        console.log('dateChange',picker);
        console.log(this.selectDate);
      },
      dateConfirm(value) {
        console.log('dateConfirm',value);
        this.selectTime = + new Date(value);
        let time = this.selectTime;
        let month = new Date(time).getMonth() + 1;
        let day = new Date(time).getDate();
        let hour = new Date(time).getHours();
        let minute = new Date(time).getMinutes();
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        hour = hour < 10 ? ('0' + hour) : hour;
        minute = minute < 10 ? ('0' + minute) : minute;
        let date = new Date(time).getFullYear() + '-' + month + '-' + day + " " + hour + ":" + minute;
        this.setTipDate(date);
      },
      dateCancel() {
        console.log('dateCancel');
        this.isShowDatePopup = false;
      },
      //设置提醒时间
      settingTipTime(detailId, remindDate, borrowCreate) {
        this.detailId = detailId;
        this.selectDate = new Date(remindDate);
        this.maxDate = new Date(borrowCreate);
        this.isShowDatePopup = true;
      },
      //后台设置某期提醒时间
      setTipDate(remindDate) {
        this.showVanLoading = true;
        myAxios('/srApp/h5/jz/remind/date', 'get', {
          // id: this.id,
          detailId: this.detailId,
          remindDate: remindDate,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            alertMsg('设置成功');
            this.isShowDatePopup = false;
            setTimeout(() => {
              this.showVanLoading = true;
              this.init();
            }, 1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
      //后台设置是否提醒
      setIsTip(flag) {
        this.showVanLoading = true;
        myAxios('/srApp/h5/jz/remind', 'get', {
          id: this.id,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            if(flag) {
              this.showVanLoading = true;
              this.init();
            }else{
              this.tipOpen = false;
            }
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
  body{
    background: #FAFAFA;
  }
  .van-picker__toolbar{
    height: 50px;
    line-height: 50px;
  }
  .van-picker__cancel,
  .van-picker__confirm{
    font-size: vw(32);
    color: #FF4040;
  }
  .van-picker__confirm{
    color: #4A90E2;
  }
  .van-picker__title{
    font-size: vw(32);
  }
  .van-picker-column__item--selected{
    color: #FF4040;
  }
  .repayTip{
    background: #fff;
    .top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: vw(26) vw(24) vw(26) 0;
      margin-left: vw(24);
      border-bottom: 1px solid #F0F0F0;
      span{
        font-size: vw(32);
        color: #4A4A4A;
        font-weight: 500;
      }
      img{
        width: vw(102);
        height: vw(68);
      }
    }
    .listWrap{
      padding: 0 vw(24);
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: vw(16) 0;
        font-size: vw(30);
        color: #888;
      }
      .title{
        padding: vw(24) 0;
        font-size: vw(28);
        color: #333;
      }
      .right{
        display: flex;
        align-items: center;
        img{
          width: vw(10);
          height: vw(16);
          margin-left: vw(18);
        }
      }
    }
  }
</style>
