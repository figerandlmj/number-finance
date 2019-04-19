<template>
  <div class="bankCard">
    <ul class="cardList">
      <li v-for="(item, index) in bankList" :key="index">
        <!--<img src="./img/cardBg.png" alt="">-->
        <img :src="item.pic" alt="">
        <div class="detail">
          <p class="name">
            {{item.bank}}
            <span v-if="item.mainCard === 1">（主卡）</span>
          </p>
          <p class="type">{{item.type || '储蓄卡'}}</p>
          <p class="cardNo">**** **** **** {{item.cardNo.substring(item.cardNo.length - 4)}}</p>
        </div>
        <div class="moreBtn" v-if="item.mainCard !== 1" @click="isShowPopup = true;cardNo = item.cardNo">...</div>
      </li>
    </ul>
    <div class="addWrap" @click="addBank">
      <img src="./img/addIcon.png" alt="">
      添加银行卡
    </div>
    <van-popup v-model="isShowPopup" position="bottom">
      <ul class="popup">
        <li @click="updateBank('main')">设为主卡</li>
        <li class="active" @click="deleteBank()">删除</li>
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
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { Dialog } from 'vant';
  import { alertMsg, nativeAppFun, myAxios } from 'assets/js/utils';
  export default {
    name: 'bankCard',
    components: {
      vanLoading,
      Dialog,
      loginInvalid
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        showVanLoading: false,// 是否显示vanLoading
        isShowPopup: false,//是否显示弹出层
        //银行卡列表
        bankList: [
          // {
          //   bank: '农业银行',
          //   cardNo: '7898',
          //   mainCard: 2,
          //   pic: './img/cardBg.png',
          //   type: '储蓄卡'
          // }
        ],
        cardNo: ''//操作的当前银行卡号
      }
    },
    created(){
      // this.init();
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        // alert('bankCard');
        if(!!window._dataFromApp.token) {
          this.init();
        }
        window.myOnload();
      };
    },
    mounted() {
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    beforeDestroy(){},
    methods:{
      //页面初始化
      init() {
        myAxios('/srApis/apis/bank/getUserBankNoInfo', 'post', {
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            this.bankList = json.data || [];
          }else{
            alertMsg(json.message);
          }
        });
      },
      //删除银行卡确认弹框
      deleteBank() {
        Dialog.confirm({
          title: '提示',
          message: '确定删除该银行卡？',
          messageAlign: 'center'
        }).then(() => {
          // on confirm
          this.updateBank('delete');
        }).catch(() => {
          // on cancel
        });
      },
      //操作银行卡（设为主卡/删除）
      updateBank(flag) {
        this.showVanLoading = true;
        myAxios('/srApis/apis/bank/updateUserBankNoInfo', 'post', {
          cardNo: this.cardNo,//银行卡尾号
          operate: flag === 'main' ? 1 : flag === 'delete' ? 0 : '',
          token: window._dataFromApp.token || ''// 登录token
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            this.isShowPopup = false;
            if(flag === 'main') {
              alertMsg('主卡变更成功');
            }else if(flag === 'delete') {
              alertMsg('删除成功');
            }
            setTimeout(() => {
              location.reload();
            }, 1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
      //点击添加银行卡，跳转页面
      addBank() {
        // 事件埋点
        h5EventBuryingPoints('wdyhk', 'click_wdyhk_tj', {});
        nativeAppFun('SR_H5Page',{
          url: location.protocol + '//' + location.host + '/h5/my/bankCardBind.html?pageSource=shurongH5',//加载url
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
  .van-dialog__message--withtitle{
    text-align: center;
  }
  .bankCard{
    padding: 0 vw(24);
    margin-top: vw(8);
    margin-bottom: vw(20);
    .cardList{
      li{
        position: relative;
        margin-top: vw(20);
        img{
          width: 100%;
          height: vw(200);
        }
        .detail{
          position: absolute;
          top: vw(20);
          left: vw(114);
          color: #fff;
        }
        .name{
          font-size: vw(32);
        }
        .type{
          font-size: vw(26);
        }
        .cardNo{
          margin-top: vw(24);
          font-size: vw(38);
        }
        .moreBtn{
          position: absolute;
          top: vw(-28);
          right: vw(28);
          font-size: vw(60);
          color: #fff;
        }
      }
    }
    .addWrap{
      display: flex;
      align-items: center;
      width: vw(258);
      font-size: vw(34);
      color: #888;
      padding: vw(66) 0;
      margin: 0 auto;
      img{
        width: vw(64);
        height: vw(64);
        margin-right: vw(20);
      }
    }
    .popup{
      background: #fff;
      li{
        padding: vw(32) 0;
        font-size: vw(30);
        color: #4A4A4A;
        text-align: center;
        &:nth-of-type(n+2){
          border-top: 1px solid #F0F0F0;
        }
      }
      .active{
        color: #FD4014;
      }
    }
  }
</style>
