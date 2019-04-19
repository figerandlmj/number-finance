<template>
  <!-- 图形验证码弹框 -->
  <div class="mask" v-show="isShow" @touchmove.prevent>
    <div class="box imgCodeBox"  :class="{ marginTop: isMarginTop }">
      <p class="title">请输入图形验证码</p>
      <div class="codeWrap">
        <input type="number" v-model="imgCodeValue" @input="imgCodeInput" @focus="codeFocus" @blur="codeBlur">
        <img :src="'data:image/png;base64,' + imgCode" alt="" @click="getImgCode">
      </div>
      <p class="tip">点击刷新验证码</p>
      <div class="btn">
        <input type="button" value="确定" @click="imgConfirm"  :style="{background: btnColor}">
      </div>
      <img class="close" src="../../assets/img/close.png" alt="" @click="closeCodeBox">
    </div>
  </div>
</template>

<script>
  import { alertMsg, myAxios } from 'assets/js/utils';
  export default {
    name: 'imgCodeBox',
    components: {
    },
    props: {
      mobile: {
        type: String,
        required: true
      },
      btnColor: {
        type: String
      },
      pointCode: {
        type: String
      }
    },
    data(){
      return{
        isShow: false,//是否显示
        imgCodeValue: '',// 图形验证码输入值
        imgCodeNum: '',// 图形验证码
        imgCode: '',// 图形验证码图片
        isFocus: false,// 是否获取焦点
        isMarginTop: false,//是否设置marginTop
        windowHeight: window.innerHeight,//窗口高度
      }
    },
    created(){
      this.getImgCode();
      //监听窗口大小变化改变弹框位置
      window.onresize = () => {
        if(this.isFocus && ((this.windowHeight - window.innerHeight) >= this.windowHeight / 4)){
          this.isMarginTop = true;
        }else{
          this.isMarginTop = false;
        }
      }
    },
    mounted() {
    },
    methods:{
      codeFocus(){//input获得焦点
        this.isFocus = true;
        //  事件埋点
        h5EventBuryingPoints(this.pointCode, 'click_' + this.pointCode + '_txyz', {});
      },
      codeBlur(){//input失去焦点
        this.isFocus = false;
      },
      closeCodeBox(){// 关闭图形验证码弹窗
        this.$emit('closeCodeBox');
      },
      imgCodeInput(){// 图形验证码input事件
        this.imgCodeValue = this.imgCodeValue.replace(/\D/g,'');
        this.imgCodeValue = this.imgCodeValue.slice(0, 4);
      },
      imgConfirm(){// 确定图形验证码
        if(this.imgCodeValue === '') {
          alertMsg('请输入图形验证码');
          return;
        }
        if(this.imgCodeValue !== this.imgCodeNum){
          alertMsg('请输入正确的图形验证码');
          return;
        }
        this.$emit('getShotMsgCode', this.imgCodeValue);
      },
      getImgCode(){// 获取图形验证码
        this.$emit('isShowVanLoading', true);
        myAxios('/srApis/h5/identifyingCode', 'get', {
          mobile: this.mobile,
        }, (json) => {
          this.$emit('isShowVanLoading', false);
          if(json.code === 200) {
            let data = json.data;
            this.imgCodeNum = data.code;
            this.imgCode = data.image;
            this.isShow = true;
          }else if(json.code === 1002) {
            $('body').scrollTop(0);
            this.$emit('closeCodeBox');
            this.$emit('openTipBox', true);
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
  @import 'assets/css/registerBox.scss';
  .imgCodeBox{
    width: vw(600);
    height: vw(430);
    padding: vw(20);
    .title{
      margin: vw(28) 0 vw(44);
      font-size: vw(30);
      color: #131000;
      text-align: center;
    }
    .codeWrap{
      display: flex;
      justify-content: center;
      align-items: flex-end;
      input{
        width: vw(200);
        margin-right: vw(30);
        padding: vw(10);
        font-size: vw(30);
        text-align: center;
        border-bottom: 2px solid #f2f2f2;
      }
      img{
        width: vw(200);
        height: vw(80);
      }
    }
    .tip{
      margin: vw(15) vw(92) 0 0;
      text-align: right;
      font-size: vw(20);
      color: #999;
    }
    .btn{
      input{
        color: #fff!important;
      }
    }
  }

</style>
