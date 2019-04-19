<template>
  <div class="bankCardBind">
    <div class="topTip">
      请绑定本人名下有效银行卡，暂不支持信用卡
      <p>所有信息只用于平台信息认证，请放心填写</p>
    </div>
    <ul class="inputWrap">
      <li>
        <div class="label">持卡人</div>
        <input type="text" placeholder="请输入真实姓名" maxlength="12" v-model="name">
      </li>
      <li>
        <div class="label">身份证</div>
        <input type="text" placeholder="请输入身份证号码" maxlength="18" v-model="idcard" @input="idcardInput">
      </li>
      <li @click="selectBank">
        <div class="label">所属银行</div>
        <input type="text" :value="bankType" placeholder="请选择所属银行" readonly id="selectInput">
        <img src="../../../assets/img/arrowRight.png" alt="" class="arrowRight">
      </li>
      <li>
        <div class="label">银行卡号</div>
        <input type="tel" placeholder="请输入储蓄卡卡号" maxlength="19" v-model="bankCardNo" @input="bankCardInput">
      </li>
      <li>
        <div class="label">预留手机号</div>
        <input type="tel" placeholder="请输入银行预留手机号" maxlength="11" v-model="phone" @input="phoneInput">
      </li>
      <li>
        <div class="label">短信验证</div>
        <input type="tel" placeholder="请输入验证码" maxlength="6" class="codeInput" v-model="msgCode" @input="msgCodeInput">
        <div class="getMsgCode active" v-if="name && idcard && bankType && bankCardNo && phone && isGetCode" @click="getMsgCode">获取验证码</div>
        <div class="getMsgCode" v-else-if="!isGetCode">{{count}}s</div>
        <div class="getMsgCode" v-else>获取验证码</div>
      </li>
    </ul>
    <div class="agreeWrap">
      <img src="../../../assets/img/checked.png" alt="" v-show="isCheck" @click="check(false)">
      <img src="../../../assets/img/check.png" alt="" v-show="!isCheck"  @click="check(true)">
      <div class="agree">
        阅读并同意<a @click="toLinkAgreementRegister">《数融用户协议》</a>
      </div>
    </div>
    <div class="submit active" v-if="name && idcard && bankType && bankCardNo && phone && msgCode && isCheck" @click="submitBankInfo">提交</div>
    <div class="submit" v-else>提交</div>
    <van-popup v-model="isShowPopup" position="bottom">
      <ul class="bankList">
        <li v-for="(item, index) in bankList" :key="index"  @click="select(index)">
          <div class="left">
            <!--<img src="./img/bankIcon.png" alt="">-->
            <img :src="item.icon" alt="">
            <span>{{item.name}}</span>
          </div>
          <div class="right">
            <img src="./img/selected.png" alt="" v-show="item.isSelected">
            <img src="./img/select.png" alt="" v-show="!item.isSelected">
          </div>
        </li>
      </ul>
    </van-popup>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { alertMsg, nativeAppFun, myAxios } from 'assets/js/utils';
  export default {
    name: 'bankCardBind',
    components: {
      vanLoading,
      loginInvalid
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        isCheck: true,//是否同意协议
        name: '',//持卡人姓名
        idcard: '',//身份证号
        bankType: '',//所属银行
        bankCardNo: '',//银行卡号
        phone: '',//预留手机号
        msgCode: '',//短信验证码
        isShowPopup: false,//是否显示所属银行列表
        //所属银行列表
        bankList: [],
        selectedIndex: 0,//被选择的所属银行的key
        isGetCode: true,//是否可点击获取验证码
        count: 60,//倒计时
      }
    },
    created(){
      this.getBankList();
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    beforeDestroy(){

    },
    methods:{
      //获取所属银行列表
      getBankList() {
        myAxios('/srApis/apis/bank/getAllBankInfo', 'post', {}, (json) => {
          if(json.code === 200){
            this.bankList = json.data || [];
          }else{
            alertMsg(json.message);
          }
        });
      },
      //短信验证码input事件
      msgCodeInput() {
        this.msgCode = this.msgCode.replace(/[^\d]/g,'');
        this.msgCode = this.msgCode.slice(0,6);
      },
      //手机号码input事件
      phoneInput() {
        this.phone = this.phone.replace(/[^\d]/g,'');
        this.phone = this.phone.slice(0, 11);
      },
      //银行卡input事件
      bankCardInput() {
        this.bankCardNo = this.bankCardNo.replace(/[^\d]/g,'');
        this.bankCardNo = this.bankCardNo.slice(0, 19);
      },
      //身份证号input事件
      idcardInput() {
        this.idcard = this.idcard.replace(/[^\d|x|X]/g, '');
        this.idcard = this.idcard.slice(0, 18);
      },
      //点击获取短信验证码
      getMsgCode() {
        if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.idcard)) {
          alertMsg('请输入正确的身份证号');
          return;
        }
        if(!/^1(3|4|5|7|8)\d{9}$/.test(this.phone)) {
          alertMsg('请输入正确的手机号');
          return;
        }
        this.showVanLoading = true;
        //发送短信验证码
        myAxios('/srApis/apis/bank/getIdentifyingCode', 'post', {
          bankCode: this.bankList[this.selectedIndex].shortName,
          cardNo: this.bankCardNo,
          idCard: this.idcard,
          phone: this.phone,
          realName: this.name
        }, (json) => {
          this.showVanLoading = false;
          if(json.code === 200) {
            alertMsg('短信验证码已发送至' + this.phone + '，请注意查收');
            this.countDown60();
          }else{
            alertMsg(json.message);
          }
        });
      },
      //点击提交银行卡信息
      submitBankInfo() {
        if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.idcard)) {
          alertMsg('请输入正确的身份证号');
          return;
        }
        if(!/^1(3|4|5|7|8)\d{9}$/.test(this.phone)) {
          alertMsg('请输入正确的手机号');
          return;
        }
        this.showVanLoading = true;
        myAxios('/srApis/apis/bank/addUserBankNoInfo', 'post', {
          param: JSON.stringify({
            bank: this.bankList[this.selectedIndex].name,
            shortName: this.bankList[this.selectedIndex].shortName,
            cardNo: this.bankCardNo,
            idCard: this.idcard,
            phone: this.phone,
            name: this.name,
            code: this.msgCode,
            token: window._dataFromApp.token || ''
          })
        }, (json) => {
          this.showVanLoading = false;
          // 事件埋点
          h5EventBuryingPoints('tjyhk', 'click_tjyhk_tj', {
            Result: json.code === 200 ? 'success' : 'fail'
          });
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200) {
            alertMsg('银行卡绑定成功');
            setTimeout(() => {
              nativeAppFun('SR_Event_Back', "", "callBackFresh");//返回
            }, 1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
      //倒计时60s
      countDown60(){
        this.isGetCode = false;
        this.count = 60;
        let timer = setInterval(() => {
          if(this.count === 0) {
            clearInterval(timer);
            this.isGetCode = true;
            return;
          }
          this.count --;
        }, 1000);
      },
      // 是否同意协议
      check(flag) {
        this.isCheck = flag;
      },
      //弹出选择所属银行框
      selectBank() {
        document.getElementById("selectInput").blur();
        this.isShowPopup = true;
      },
      //选择所属银行
      select(index) {
        if(this.bankList[index].isSelected) {
           this.isShowPopup = false;
        }else{
          this.bankList[this.selectedIndex].isSelected = false;
          this.selectedIndex = index;
          this.bankList[this.selectedIndex].isSelected = true;
          this.bankType = this.bankList[this.selectedIndex].name;
          this.isShowPopup = false;
        }
      },
      //跳转数融用户协议
      toLinkAgreementRegister() {
        nativeAppFun('SR_H5Page',{
          url: location.protocol + '//' + location.host + '/h5/agreementRegister.html',//加载url
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
    background: rgb(242,242,242);
  }
  .bankCardBind{
    .topTip{
      width: 100%;
      padding: vw(26) vw(24);
      font-size: vw(30);
      color: #333;
      background: #fff;
      p{
        margin-top: vw(10);
        font-size: vw(28);
        color: #666;
      }
    }
    .inputWrap{
      background: #fff;
      border-top: 1px solid #E6E6E6;
      li{
        position: relative;
        display: flex;
        align-items: center;
        height: vw(106);
        margin-left: vw(24);
        padding-right: vw(24);
        &:nth-of-type(n+2){
          border-top: 1px solid #F3F3F3;
        }
      }
      .label{
        width: vw(220);
        font-size: vw(28);
        color: #333;
      }
      input{
        width: 100%;
        height: 100%;
        font-size: vw(28);
        color: #333;
      }
      .codeInput{
        margin-right: vw(170);
        margin-left: vw(50);
      }
      .arrowRight{
        position: absolute;
        top: vw(40);
        right: vw(24);
        width: vw(16);
        height: vw(24);
      }
      .getMsgCode{
        position: absolute;
        top: vw(22);
        right: vw(24);
        width: vw(180);
        padding: vw(10) vw(16);
        font-size: vw(28);
        color: #BABABA;
        text-align: center;
        border: 1px solid #BABABA;
        border-radius: 3px;
        &.active{
          color: #2C8CF1;
          border: 1px solid #2C8CF1;
        }
      }
    }
    .agreeWrap{
      display: flex;
      align-items: center;
      margin: vw(28) vw(24) vw(158);
      img{
        width: vw(34);
        height: vw(34);
        margin-right: vw(20);
      }
      .agree{
        font-size: vw(24);
        color: #9F9F9F;
      }
      a{
        font-size: vw(24);
        color: #2C8CF1;
      }
    }
    .submit{
      width: vw(670);
      height: vw(88);
      margin: 0 auto;
      line-height: vw(88);
      font-size: vw(32);
      color: #BABABA;
      text-align: center;
      background: rgba(229,229,229,1);
      border-radius: vw(40);
      &.active{
        color: #333;
        background: #FFD93B;
      }
    }
    .bankList{
      height: vw(727);
      overflow-y: scroll;
      background: #fff;
      li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: vw(30) vw(24);
        border-top: 1px solid #F3F3F3;
      }
      .left{
        display: flex;
        align-items: center;
        img{
          width: vw(60);
          height: vw(60);
          margin-right: vw(32);
        }
        span{
          font-size: vw(32);
          color: #333;
        }
      }
      .right{
        img{
          width: vw(48);
          height: vw(48);
        }
      }
    }
  }

</style>
