<template>
  <div class="record">
    <ul class="main">
      <li>
        <div class="left">借款金额</div>
        <div class="right">
          <input type="tel" value="0.00" placeholder="请输入借款金额" class="money" v-model="borrowAmount">
        </div>
      </li>
      <li>
        <div class="left">借款期数</div>
        <div class="right" @click="isShowPopup = true">{{number}}期</div>
      </li>
      <li>
        <div class="left">借款时间</div>
        <div class="right" @click="isShowDatePopup = true">{{inputDate}}</div>
      </li>
      <li>
        <div class="left">借款方</div>
        <div class="right">
          <input type="text" value="" placeholder="请输入借款平台名称" v-model="borrowName">
        </div>
      </li>
      <li>
        <div class="left">开启到期日还款提醒</div>
        <div class="right">
          <img src="./img/tipOpen.png" alt="" class="tipBtn" v-if="tipOpen" @click="tipOpenOrOff(false)">
          <img src="./img/tipOff.png" alt="" class="tipBtn" v-else @click="tipOpenOrOff(true)">
        </div>
      </li>
    </ul>
    <div class="submitBtn" @click="recordSubmit">提交</div>
    <!-- 借款期数选择弹框 -->
    <van-popup v-model="isShowPopup" position="bottom" class="popupBox">
      <div class="title">
        <span>借款期数</span>
        <span @click="isShowPopup = false" class="cancel">取消</span>
      </div>
      <ul>
        <li v-for="(item, index) in 24" :key="index" @click="selectNumber(item)" :class="{active: number === item}">{{item}}</li>
      </ul>
    </van-popup>
    <!-- 日期选择弹框 -->
    <van-popup v-model="isShowDatePopup" position="bottom" class="datePopupBox">
      <van-datetime-picker
        v-model="selectDate"
        type="date"
        title="选择日期"
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
  import { alertMsg, linkToLogin, nativeAppFun, myAxios, getSystemTime } from 'assets/js/utils';
  export default {
    name: 'record',
    components: {
      vanLoading,
      loginInvalid,
      vanPopup: Popup,
      vanDatetimePicker: DatetimePicker
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        borrowAmount: "0.00",//借款金额
        number: 1,//借款期数
        tipOpen: true,//是否开启到期日还款提醒
        isShowPopup: false,//是否显示借款期数选择弹框
        isShowDatePopup: false,//是否显示日期选择弹框
        selectTime: + new Date(),//当前选中时间
        selectDate: new Date(),//当前选中日期
        minDate: new Date(new Date().getFullYear() - 1, 0, 1),//所选最小日期
        maxDate: new Date(),//所选最大日期
        inputDate: "今天",//当前显示日期
        borrowName: '',//借款方
      }
    },
    created(){
      this.setDatePopup();
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
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
      //选择期数
      selectNumber(number) {
        this.number = number;
        this.isShowPopup = false;
      },
      //是否开启到期日还款提醒
      tipOpenOrOff(flag) {
        this.tipOpen = flag;
      },
      //开启日期选择弹框
      setDatePopup() {
        this.selectDate = new Date(this.selectTime);
        this.minDate = new Date(new Date(this.selectTime).getFullYear() - 1, 0, 1);
        this.maxDate = this.selectDate;
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
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        this.inputDate = new Date(time).getFullYear() + '/' + month + '/' + day;
        this.isShowDatePopup = false;
      },
      dateCancel() {
        console.log('dateCancel');
        this.selectDate = new Date(this.selectTime);
        this.isShowDatePopup = false;
      },
      //记账提交
      recordSubmit() {
        if(this.borrowAmount <= 0) {
          alertMsg('请输入借款金额');
          return;
        }
        if(this.borrowName === '') {
          alertMsg('请输入借款方名称');
          return;
        }
        this.showVanLoading = true;
        myAxios('/srApp/h5/jz/add', 'post', {
          borrowAmount: this.borrowAmount,
          borrowCreate: this.inputDate.split('/').join('-'),
          borrowName: this.borrowName,
          isRemind: this.tipOpen,
          nper: this.number,
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            alertMsg('添加成功');
            setTimeout(() => {
              location.reload();
            }, 1500);
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
  .record{
    .main{
      width: 100%;
      margin-bottom: vw(120);
      background: #fff;
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: vw(36) vw(24) vw(36) 0;
        margin-left: vw(24);
        &:nth-of-type(n + 2) {
          border-top: 1px solid #F0F0F0;
        }
        .left{
          font-size: vw(28);
          color: #888;
        }
        .right{
          flex: 1;
          font-size: vw(28);
          color: #333;
          text-align: right;
          input{
            display: inline-block;
            width: 100%;
            height: 100%;
            text-align: right;
          }
          .money{
            font-size: vw(40);
            color: #FF4040;
          }
          .tipBtn{
            display: inline-block;
            width: vw(102);
            height: vw(68);
          }
        }
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
    .popupBox{
      height: vw(482);
      overflow-y: scroll;
      .title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: vw(80);
        line-height: vw(80);
        padding: 0 vw(24);
        font-size: vw(32);
        color: #333;
        font-weight: 500;
        text-align: center;
        .cancel{
          color: #FF4040;
        }
      }
      li{
        height: vw(80);
        line-height: vw(80);
        border-top: 1px solid #F0F0F0;
        font-size: vw(28);
        color: #333;
        text-align: center;
      }
      .active{
        color: #FF4040;
      }
    }
  }
</style>
