<template>
  <div class="unionProductsBox">
    <!-- 端内申请弹框-无真实姓名 -->
    <div class="mask" @touchmove.prevent v-if="box['insideName']">
      <div class="box insideName">
        <div class="close">
          <img src="../../assets/img/close2.png" alt="" @click="close('insideName')">
        </div>
        <input type="text" placeholder="请输入真实姓名，提交后不支持修改" maxlength="12" class="input" v-model="name">
        <div class="agreeWrap">
          <img src="../../assets/img/checked.png" alt="" v-show="isCheck" @click="check(false)">
          <img src="../../assets/img/check.png" alt="" v-show="!isCheck"  @click="check(true)">
          <div class="agree">
            同意<a @click="toLinkAgreementAutho">《联合注册授权书》</a>
          </div>
        </div>
        <div class="btn active" v-if="name && isCheck" @click="insideApply">确定</div>
        <div class="btn" v-else>确定</div>
      </div>
    </div>
    <!-- 端内申请弹框-已提交真实姓名 -->
    <div class="mask" @touchmove.prevent v-if="box['inside']">
      <div class="box inside">
        <div class="close">
          <img src="../../assets/img/close2.png" alt="" @click="close('inside')">
        </div>
        <p class="title">注册成为{{currentUnion.productName}}的用户</p>
        <div class="agreeWrap">
          <img src="../../assets/img/checked.png" alt="" v-show="isCheck" @click="check(false)">
          <img src="../../assets/img/check.png" alt="" v-show="!isCheck"  @click="check(true)">
          <div class="agree">
            同意<a @click="toLinkAgreementAutho">《联合注册授权书》</a>
          </div>
        </div>
        <div class="btn active" v-if="isCheck" @click="insideApply">确定</div>
        <div class="btn" v-else>确定</div>
      </div>
    </div>
    <!-- 端外申请弹框-补充信息弹窗 -->
    <div class="mask" @touchmove.prevent v-show="box['outside']">
      <div class="box outside">
        <div class="close">
          <img src="../../assets/img/close2.png" alt="" @click="close('outside')">
        </div>
        <p class="title">完善信息，立即拿款</p>
        <input type="text" placeholder="请输入真实姓名，提交后不支持修改" maxlength="12" class="input name" v-model="name">
        <input type="tel" placeholder="请输入手机号" maxlength="11" class="input phone" v-model="phone" @input="telInput">
        <div class="msgCodeWrap">
          <input type="tel" placeholder="请输入短信验证码" maxlength="4" class="input msgCode" v-model="msgCode" @input="shotMsgCodeInput">
          <span class="getMsgCode active" v-if="name && phone && /^1(3|4|5|7|8)\d{9}$/.test(phone) && otherParam.isGetCode" @click="getImgCode">点击获取</span>
          <span class="getMsgCode" v-else-if="!otherParam.isGetCode">{{otherParam.count}}s</span>
          <span class="getMsgCode" v-else>点击获取</span>
        </div>
        <div class="agreeWrap">
          <img src="../../assets/img/checked.png" alt="" v-show="isCheck" @click="check(false)">
          <img src="../../assets/img/check.png" alt="" v-show="!isCheck"  @click="check(true)">
          <div class="agree">
            同意<a @click="toLinkAgreementAutho">《联合注册授权书》</a>
          </div>
        </div>
        <div class="btn active" v-if="name && phone && /^1(3|4|5|7|8)\d{9}$/.test(phone) && msgCode && isCheck" @click="outsideApply">一键申请</div>
        <div class="btn" v-else>一键申请</div>
      </div>
    </div>
    <!-- 端外申请弹框-老用户授权弹窗 -->
    <div class="mask" @touchmove.prevent v-if="box['outsideOldUser']">
      <div class="box inside outsideOldUser">
        <div class="close">
          <img src="../../assets/img/close2.png" alt="" @click="close('outsideOldUser')">
        </div>
        <p class="title">注册成为{{currentUnion.productName}}的用户</p>
        <div class="agreeWrap">
          <img src="../../assets/img/checked.png" alt="" v-show="isCheck" @click="check(false)">
          <img src="../../assets/img/check.png" alt="" v-show="!isCheck"  @click="check(true)">
          <div class="agree">
            同意<a @click="toLinkAgreementAutho">《联合注册授权书》</a>
          </div>
        </div>
        <div class="btn active" v-if="isCheck" @click="outsideApply">确定</div>
        <div class="btn" v-else>确定</div>
      </div>
    </div>
    <!-- 图形验证码弹框 -->
    <div class="mask" @touchmove.prevent v-show="box['imgCode']">
      <div class="box imgCode">
        <div class="close">
          <img src="../../assets/img/close2.png" alt="" @click="close('imgCode')">
        </div>
        <div class="imgCodeWrap">
          <div class="wrap">
            <input type="text" placeholder="请输入图形验证码" maxlength="4" class="input imgCode" v-model="imgCode">
            <img :src="'data:image/png;base64,' + otherParam.imgCodeImage" alt="" @click="getImgCode">
          </div>
          <p class="imgCodeTip" @click="getImgCode">看不清？换一张</p>
        </div>
        <div class="btn active" v-if="imgCode" @click="getMsgCode">确定</div>
        <div class="btn" v-else>确定</div>
      </div>
    </div>
    <!-- 申请失败弹框 -->
    <div class="mask" @touchmove.prevent v-if="box['failTip']">
      <div class="box failTip">
        <div class="close">
          <img src="../../assets/img/close2.png" alt="" @click="close('failTip')">
        </div>
        <img src="./img/failIcon.png" alt="" class="failIcon">
        <p class="title">很遗憾，申请失败了</p>
        <p class="detail">您是{{currentUnion.productName}}的老用户<br>去首页看看别的产品吧</p>
        <div class="btn">{{otherParam.autoCloseSecond}}s后自动关闭弹窗</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { alertMsg, nativeAppFun } from 'assets/js/utils';
  export default {
    name: 'unionProductsBox',
    components: {
    },
    props: {
      // 弹框显示状态
      box: {
        type: Object,
        required: true
      },
      currentUnion: {
        type: Object,
        required: true
      },
      otherParam: {
        type: Object,
        required: true
      },
    },
    data(){
      return{
        name: '',//真实姓名
        phone: '',//手机号码
        msgCode: '',//短信验证码
        imgCode: '',//图形验证码
        isCheck: true,//是否同意联合注册授权书
        // // 弹框显示状态
        // box: {
        //   'insideName': false,
        //   'inside': false,
        //   'outside': false,
        //   'outsideOldUser': false,
        //   'imgCode': false,
        //   'failTip': false
        // },
      }
    },
    created(){

    },
    mounted() {

    },
    methods:{
      telInput(){// 手机号码input事件
        this.phone = this.phone.replace(/[^\d]/g,'');
        this.phone = this.phone.slice(0, 11);
      },
      shotMsgCodeInput(){//短信验证码input事件
        this.msgCode = this.msgCode.replace(/[^\d]/g,'');
        this.msgCode = this.msgCode.slice(0, 6);
      },
      // 是否同意联合注册授权书
      check(flag) {
        this.isCheck = flag;
      },
      // 关闭弹框
      close(flag) {
        this.box[flag] = false;
        if(flag === "insideName") {
          this.name = "";
          this.isCheck = true;
        }else if(flag === "inside") {
          this.isCheck = true;
        }else if(flag === "outside") {
          this.name = "";
          this.phone = "";
          this.msgCode = "";
          this.otherParam.isGetCode = true;
          this.isCheck = true;
        }else if(flag === "outsideOldUser") {
          this.isCheck = true;
        }else if(flag === 'imgCode') {
          this.box['outside'] = true;
        }else if(flag === 'failTip') {
          this.name = "";
          this.phone = "";
          this.msgCode = "";
          this.otherParam.isGetCode = true;
          this.isCheck = true;
        }
      },
      //获取图形验证码
      getImgCode() {
        this.imgCode = "";
        this.$emit('getImgCode', this.phone);
      },
      //获取短信验证码
      getMsgCode() {
        if(this.imgCode !== this.otherParam.imgCodeNum) {
          alertMsg('图形验证码错误');
          this.imgCode = "";
          return;
        }
        this.$emit('getMsgCode', this.imgCode, this.phone);
      },
      //端内确定申请
      insideApply() {
        this.$emit('insideApply', this.name);
      },
      //端外确定申请
      outsideApply() {
        this.$emit('outsideApply', this.name, this.phone, this.msgCode);
      },
      //跳转联合注册授权书
      toLinkAgreementAutho() {
        nativeAppFun('SR_H5Page',{
          url: location.protocol + '//' + location.host + '/h5/agreementAuthorize.html',//加载url
        });
      }
    }
  }
</script>

<style lang="scss">
  @function vw($px) {
    @return ($px / 750) * 100vw;
  }
  /* 联登商品申请弹框 */
  .unionProductsBox{
    .mask{
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0,0,0,.7);
    }
    .box{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%,-50%,0);
      box-sizing: border-box;
      width: vw(580);
      padding: vw(28) vw(30) vw(36);
      background: #fff;
      border-radius: vw(12);
    }
    .btn{
      width: vw(420);
      height: vw(70);
      line-height: vw(70);
      margin: vw(44) auto 0;
      font-size: vw(30);
      color: #BABABA;
      text-align: center;
      border-radius: vw(35);
      background: rgba(229,229,229,1);
    }
    .active{
      color: #333;
      background: #FFD93B;
    }
    .close{
      img{
        float: right;
        width: vw(30);
        height: vw(28);
      }
      &::after{
        content: '';
        display: block;
        clear: both;
      }
    }
    .agreeWrap{
      display: flex;
      align-items: center;
      margin: vw(20) 0 vw(44);
      img{
        width: vw(34);
        height: vw(34);
        margin-right: vw(20);
      }
      .agree{
        font-size: vw(26);
        color: #666;
      }
      a{
        font-size: vw(26);
        color: #2C8CF1;
      }
    }
    .title{
      font-size: vw(34);
      color: #333;
      text-align: center;
    }
    .input{
      box-sizing: border-box;
      width: 100%;
      height: vw(80);
      padding: vw(20);
      margin-top: vw(32);
      font-size: vw(28);
      color: #333;
      background: rgba(243,243,243,1);
      border-radius: 3px;
    }
    .inside{
      .title{
        margin-top: vw(20);
      }
      .agreeWrap{
        justify-content: center;
      }
    }
    .outside{
      .input{
        height: vw(76);
      }
      .name{
        margin-top: vw(30);
      }
      .phone{
        margin-top: vw(20);
      }
    }
    .msgCodeWrap{
      display: flex;
      align-items: center;
      margin-top: vw(20);
      .msgCode {
        flex: 3;
        margin-top: 0;
      }
      .getMsgCode{
        flex: 2;
        height: vw(76);
        line-height: vw(76);
        margin-left: vw(20);
        font-size: vw(28);
        color: #888;
        text-align: center;
        background: rgba(219,219,219,1);
        border-radius: 3px;
      }
      .active{
        color: #333;
        background: #FFD93B;
      }
    }
    .imgCodeWrap{
      position: relative;
      width: 90%;
      margin: 0 auto vw(80);
      .wrap{
        display: flex;
        align-items: center;
      }
      .imgCode{
        flex: 1;
      }
      img{
        width: vw(190);
        height: vw(80);
        margin-left: vw(10);
        margin-top: vw(32);
      }
      .imgCodeTip{
        position: absolute;
        top: vw(120);
        right: 0;
        width: vw(200);
        font-size: vw(12);
        color: #C1C1C1;
        text-align: center;
      }
    }
    .failTip{
      .failIcon{
        width: vw(118);
        height: vw(152);
        margin: 0 auto;
      }
      .title{
        margin-top: vw(14);
      }
      .detail{
        margin-top: vw(16);
        font-size: vw(26);
        color: #888;
        text-align: center;
      }
    }
  }
</style>
