<template>
  <div class="loanMarket">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :class="{vanRefresh: isPreventRefresh}">
      <!-- 下拉刷新图片-->
      <div class="refreshImg" slot="pulling"><img src="../../assets/img/pullRefresh/refresh.png"/></div>
      <div class="refreshImg" slot="loading"><img src="../../assets/img/pullRefresh/refresh.gif"/></div>
      <div class="refreshImg" slot="loosing"><img src="../../assets/img/pullRefresh/refresh.png"/></div>
      <template v-for="(item, index) in templeteList">
        <!-- 图文卡片 -->
        <img-word-card v-if="item.templet_type === 11" :imgWordArr="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></img-word-card>
        <!-- 滑动卡片 -->
        <slide-card v-if="item.templet_type === 12" :imgList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></slide-card>
        <!-- 联登商品 -->
        <union-products v-if="item.templet_type === 13" :productList="item.templet || []" :agent="agent" :isShowMyApply="isShowMyApply" @linkRecord="linkRecord" @unionJumpLink="unionJumpLink" :class="{marginTop10: index !== 0}"></union-products>
        <!-- 轮播图片广告1 -->
        <img-swipe v-if="item.templet_type === 1" :imgList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></img-swipe>
        <!-- 跑马灯公告 -->
        <roll-notice v-if="item.templet_type === 4" :noticeList="item.templet || []" @jumpLink="jumpLink"></roll-notice>
        <!-- 资讯列表 -->
        <information v-if="item.templet_type === 9" :tabList="item.chart_tab || []" :informationList="item.templet || []" :templateIndex="index" @jumpLink="jumpLink" @preventRefresh="preventRefresh" @isShowVanLoading="isShowVanLoading" :class="{marginTop10: index !== 0}"></information>
        <!-- 贷超列表 -->
        <loan-products v-if="item.templet_type === 6" :tabList="tabList" :loanProducts="item.templet || []" :templateIndex="index" @jumpLink="jumpLink" @preventRefresh="preventRefresh" :class="{marginTop10: index !== 0}"></loan-products>
        <!-- icon广告 -->
        <icon-ad v-if="item.templet_type === 5" :iconAdList="item.templet || []" @jumpLink="jumpLink" :class="{paddingTop: !templeteList[index - 1] || templeteList[index - 1].templet_type != 5,paddingBottom: !templeteList[index + 1] || templeteList[index + 1].templet_type != 5,marginTop10: index !== 0 && templeteList[index - 1].templet_type != 5,borderLeftRight: (templeteList[index - 1] && templeteList[index - 1].templet_type == 5) || (templeteList[index + 1] && templeteList[index + 1].templet_type == 5),borderTop: templeteList[index - 1] && templeteList[index - 1].templet_type == 5}"></icon-ad>
        <!-- 单图广告 -->
        <img-ad-one v-if="item.templet_type === 2" :imgList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></img-ad-one>
        <!-- 双图广告 -->
        <img-ad-two v-if="item.templet_type === 3" :imgList="item.templet || []" @jumpLink="jumpLink" :class="{marginTop10: index !== 0}"></img-ad-two>
        <!-- 底部提示语 -->
        <bottom-tip v-if="item.templet_type === 8" :bottomTip="item.templet || []" @jumpLink="jumpLink"></bottom-tip>
      </template>
    </van-pull-refresh>
    <!-- 右侧角标 -->
    <buoy :buoy="buoy" @jumpLink="jumpLink"></buoy>
    <!-- vanLoading -->
    <van-loading v-show="showVanLoading"></van-loading>
    <!-- 联登商品申请弹框 -->
    <union-products-box :box="box" :currentUnion="currentUnion" :otherParam="otherParam" @insideApply="insideApply" @outsideApply="outsideApply" @getImgCode="getImgCode" @getMsgCode="getMsgCode"></union-products-box>
    <!-- 登录状态失效弹框 -->
    <login-invalid :loginInvalid="loginInvalid"></login-invalid>
  </div>
</template>

<script>
  import { PullRefresh } from 'vant';// 下拉刷新
  import imgSwipe from 'components/module/imgSwipe';
  import rollNotice from 'components/module/rollNotice';
  import iconAd from 'components/module/iconAd';
  import imgAdOne from 'components/module/imgAdOne';
  import imgAdTwo from 'components/module/imgAdTwo';
  import bottomTip from 'components/module/bottomTip';
  import information from 'components/module/information';
  import loanProducts from 'components/module/loanProducts';
  import buoy from 'components/module/buoy';
  import imgWordCard from 'components/module/imgWordCard';
  import slideCard from 'components/module/slideCard';
  import unionProducts from 'components/module/unionProducts';
  import unionProductsBox from 'components/module/unionProductsBox';
  import vanLoading from 'components/vanLoading/index';
  import loginInvalid from 'components/loginInvalid/index';//登录状态失效弹框
  import { getUrlPara, alertMsg, nativeAppFun, linkToLogin, userAgent, myAxios } from 'assets/js/utils';

  export default {
    name: 'loanMarket',
    components: {
      vanPullRefresh: PullRefresh,
      imgSwipe,
      rollNotice,
      iconAd,
      imgAdOne,
      imgAdTwo,
      bottomTip,
      information,
      loanProducts,
      buoy,
      imgWordCard,
      slideCard,
      unionProducts,
      unionProductsBox,
      vanLoading,
      loginInvalid
    },
    data(){
      return{
        loginInvalid: false,//登录状态是否失效
        isPreventRefresh: false,// 是否阻止下拉刷新
        pageTitle: getUrlPara('pageTitle'),//页面标题
        // appPageTemplateId: getUrlPara('appPageTemplateId'),//应用模板页面ID
        code: getUrlPara('code'),//贷超页面编码
        dcqdCode: getUrlPara('channel'),//贷超渠道编码
        myIntegralType: getUrlPara('myIntegralType'), //阅读资讯 / 浏览产品
        isLoading: false,// 是否在加载中
        showVanLoading: false,// 是否显示vanLoading
        templeteList: [],// 模块化列表
        tabList: [],// 贷超tab
        buoy: [],// 右侧角标
        agent: userAgent(),//端内or端外
        // 联登商品申请弹框显示状态
        box: {
          'insideName': false,//无真实姓名
          'inside': false,
          'outside': false,
          'outsideOldUser': false,//端外当前窗口页面第二次申请
          'imgCode': false,
          'failTip': false
        },
        currentBox: '',//当前显示弹框
        isUserName: false,//是否有用户姓名
        currentUnion: {},//当前申请的联登商品参数
        //弹框组件中的其他参数
        otherParam: {
          imgCodeNum: '',// 获取的图形验证码
          imgCodeImage: '',// 获取的图形验证码图片
          //用于倒计时60s
          isGetCode: true,//是否可点击获取验证码
          count: 60,//倒计时
          autoCloseSecond: 3,// 自动关闭时间(s)
        },
        outsideOldUserData: '',//端外当前窗口页面第二次申请缓存数据
        isShowMyApply: false,//是否显示申请记录入口
      }
    },
    created(){
      document.title = this.pageTitle;
      //当前是否在数融app里面
      if(this.agent !== 'pgy_shurong') {
        this.init();
        window.myOnload();
      }
      //获取从原生App传过来的数据之后的回调
      window.getConfigFromAppCallback = () => {
        this.init();
        this.checkUserName();
        window.myOnload();
      };
    },
    mounted() {
      //获取缓存数据
      let outsideOldUserData = sessionStorage.getItem('outsideOldUserData');
      if(!!outsideOldUserData) {
        this.outsideOldUserData =  JSON.parse(outsideOldUserData);
      }
      //隐藏页面加载动图
      $('#pageLoading').hide();
    },
    methods:{
      isShowVanLoading(flag){// 是否显示vanLoading
        this.showVanLoading = flag;
      },
      // 是否阻止页面刷新
      preventRefresh(flag) {
        this.isPreventRefresh = flag;
      },
      // 下拉刷新时触发
      onRefresh(){
        // location.reload();
        let href = location.href;
        window.location.href = href.indexOf('?') > 0 ? href + "&timeStamp=" + (+new Date()) : href + "?timeStamp=" + (+new Date());
      },
      //跳转申请记录
      linkRecord() {
        //判断是否登录，否则前去登录
        if(!linkToLogin()){
          return;
        }
        nativeAppFun('SR_H5Page',{
          url: location.protocol + '//' + location.host + '/h5/my/myApply.html?pageSource=shurongH5',//加载url
        });
      },
      //联登商品立即申请
      unionJumpLink(item) {
        this.currentUnion = item;
        let link = item.productUrl;
        // 事件埋点
        h5EventBuryingPoints('mk', 'click_mk_ldsp', {
          picTitle: item.title,
          Pid: item.daichaoId || '', //商品编码
          url: link,// 跳转链接
          code: this.code,//贷超页面编码
          dcqdCode: this.dcqdCode//贷超渠道编码
        });

        //判断是否登录，否则前去登录
        if(!link || (this.agent === 'pgy_shurong' && !linkToLogin())){
          return;
        }

        //弹框
        if(this.agent === 'pgy_shurong'){//端内
          if(this.isUserName) {//有用户姓名
            this.currentBox = 'inside';
          }else{
            this.currentBox = 'insideName';
          }
        }else{//端外
          if(this.outsideOldUserData !== '') {
            this.currentBox = 'outsideOldUser';
          }else{
            this.currentBox = 'outside';
          }
        }
        this.box[this.currentBox] = true;
      },
      //端内确定申请
      insideApply(name) {
        this.showVanLoading = true;
        myAxios('/srApis/apis/unionLoadProduct/create', 'post', {
          pId: this.currentUnion.id,//联登商品编号
          token: window._dataFromApp.token || '',// 登录token
          userName: name//用户姓名
        }, (json) => {
          this.showVanLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else if(json.code === 200){
            alertMsg('申请成功');
            this.box[this.currentBox] = false;
            setTimeout(() => {
              location.reload();
            }, 1500);
            let url = this.currentUnion.productUrl;
            setTimeout(() => {
              nativeAppFun('SR_H5Page',{
                url: url,//加载url
              });
            }, 1500);
          }else{
            alertMsg(json.message);
          }
        });
      },
      //端外确定申请
      outsideApply(name, phone, msgCode) {
        this.showVanLoading = true;
        myAxios('/srApis/apis/unionLoadProduct/load', 'post', {
          name: name || this.outsideOldUserData.name,
          phone: phone || this.outsideOldUserData.phone,
          code: msgCode || '',
          pId: this.currentUnion.id,//联登商品编号
        }, (json) => {
          this.showVanLoading = false;
          if(json.code === 200){
            alertMsg('申请成功');
            //缓存申请数据
            if(this.outsideOldUserData === '') {
              sessionStorage.setItem('outsideOldUserData',JSON.stringify({
                name: name,
                phone: phone
              }));
            }
            this.box[this.currentBox] = false;
            setTimeout(() => {
              //页面跳转
              nativeAppFun('SR_H5Page',{
                url: this.currentUnion.productUrl,//加载url
              });
            }, 1500);
          }else if(json.code === 5015) {//老用户申请失败弹窗
            this.box[this.currentBox] = false;
            this.box['failTip'] = true;
            this.autoClose();
          }else{
            alertMsg(json.message);
          }
        });
      },
      //链接跳转
      jumpLink(link, id, pointSubCode, obj, adType){
        // 资讯底层页链接
        let linkUrl = location.protocol + '//' + location.host + '/h5/informationDetail.html?pageSource=shurongH5&contributionId=' + id;
        if(this.myIntegralType === 'read') {
          linkUrl += '&myIntegralType=' + this.myIntegralType;
        }
        // 事件埋点
        obj = Object.assign({}, obj || {}, {
          url: link || (id ? linkUrl : "") || adType || "",// 跳转链接
          code: this.code,//贷超页面编码
          dcqdCode: this.dcqdCode//贷超渠道编码
        });
        h5EventBuryingPoints('mk', pointSubCode, obj);

        //判断是否登录，否则前去登录
        if(this.agent === 'pgy_shurong' && !linkToLogin()){
          return;
        }

        //判断是否有跳转链接
        if(!link && !id && (!adType || (!!adType && adType.indexOf('SR_') === -1))) {
          return;
        }

        //判断是否是在app外部的跳转
        if(this.agent !== 'pgy_shurong' && !!adType && adType.indexOf('SR_') > -1){
          return;
        }

        //页面跳转
        let json = {
          url: link || linkUrl,//加载url
          // title: '',  //标题
          // iconType: 'share'  //右上按钮
        };
        if(!!link){
          // json.iconType = '';
          nativeAppFun('SR_H5Page',json);
        }else if(!!id){
          nativeAppFun('SR_H5Page',json);
        }else if(!!adType && adType.indexOf('SR_') > -1){//跳转原生页面
          nativeAppFun(adType);
        }
      },
      init(){// 初始化页面数据
        myAxios('/srApis/h5/pageTemlate', 'get', {
          // appPageTemplateId: this.appPageTemplateId,
          code: this.code,
          token: window._dataFromApp.token || ''
        }, (json) => {
          this.isLoading = false;
          if(json.loginInvalid) {
            this.loginInvalid = true;
          }else{
            this.initCallback(json);
          }
        });
      },
      initCallback(json){//初始化回到函数
        if(json.code === 200) {
          let data = json.data;
          this.isShowMyApply = data.isShow || false;
          this.tabList = data.goods_tab || [];
          let templete_list = data.templete_list || [];
          let len = templete_list.length;
          this.templeteList = templete_list;
          // 获取右侧角标
          for(let i = 0; i < len; i ++) {
            if(templete_list[i].templet_type === 7) {
              this.buoy = templete_list[i].templet;
              templete_list.splice(i, 1);
              this.templeteList = templete_list;
              return;
            }
          }
        }else{
          alertMsg(json.message);
        }
      },
      //校验是否有用户姓名
      checkUserName() {
        if(this.agent === 'pgy_shurong' && window._dataFromApp.token){
          myAxios('/srApis/apis/unionLoadProduct/checkUserName', 'post', {
            token: window._dataFromApp.token || ''// 登录token
          }, (json) => {
            if(json.loginInvalid) {
              this.loginInvalid = true;
            }else if(json.code === 200){
              this.isUserName = true;
            }else if(json.code !== 1004){
              alertMsg(json.message);
            }
          });
        }
      },
      //获取图形验证码
      getImgCode(phone) {
        this.showVanLoading = true;
        myAxios('/srApis/apis/unionProductms/validateImage', 'post', {
          phone: phone,
        }, (json) => {
          this.showVanLoading = false;
          if(json.code === 200) {
            let data = json.data;
            this.otherParam.imgCodeNum = data.code;
            this.otherParam.imgCodeImage = data.imageCode;
            this.box['outside'] = false;
            this.box['imgCode'] = true;
          }else{
            alertMsg(json.message);
          }
        });
      },
      //获取短信验证码
      getMsgCode(imgCode, phone) {
        this.showVanLoading = true;
        //发送短信验证码
        myAxios('/srApis/apis/unionProductms/checkImage', 'post', {
          phone: phone,
          code: imgCode,
        }, (json) => {
          this.showVanLoading = false;
          if(json.code === 200) {
            alertMsg('短信验证码已发送至' + phone + '，请注意查收');
            this.countDown60();
            this.box['imgCode'] = false;
            this.box['outside'] = true;
            this.currentBox = 'outside';
          }else{
            alertMsg(json.message);
          }
        });
      },
      //倒计时60s
      countDown60(){
        this.otherParam.count = 60;
        this.otherParam.isGetCode = false;
        let timer = setInterval(() => {
          if(this.otherParam.count === 0) {
            clearInterval(timer);
            this.otherParam.isGetCode = true;
            return;
          }
          this.otherParam.count --;
        }, 1000);
      },
      //3s后自动关闭failTip弹框
      autoClose() {
        this.otherParam.autoCloseSecond = 3;
        let timer = setInterval(() => {
          this.otherParam.autoCloseSecond --;
          if(this.otherParam.autoCloseSecond < 0) {
            this.box['failTip'] = false;
            clearTimeout(timer);
            setTimeout(() => {
              location.reload();
            }, 1500);
          }
        }, 1000);
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
  /* 下拉刷新图片 */
  .vanRefresh{
    .van-pull-refresh__track{
      display: inline;
    }
  }
  .refreshImg {
    background: #f7f7f7;
    img {
      display: inline-block;
      width: 30px;
      margin: 0 auto;
    }
  }
  .loanMarket{
    position: relative;
    padding-bottom: vw(30);
    .marginTop10{
      margin-top: vw(15);
    }
  }
</style>
