// components/user/index.js
const app = getApp();
import { request } from "../../utils/request.js";

var authMark = false;
Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    hasUserInfo: false,
    avatarUrl: "",
    nickName: "",
    sport: 0,
    vitality: 0,
    sex: 0,
    age: 0,

    showLogin: false,
    plan_describe: '',
    menuList:[
      {name:'个人信息', icon:'user-icon.svg', href:'/pages/user/userinfo'},
      {name:'我的订单', icon:'order-icon.svg', href:'/pages/order/order'},
      {name:'会员卡兑换', icon:'exchange-icon.svg', href:'/pages/member/exchange'},
      {name:'我的优惠券', icon:'coupon-icon.svg', href:'/pages/order/coupon'},
      {name:'自动续费管理', icon:'money-icon.svg', href:'/pages/member/autorenew'},
      {name:'意见反馈', icon:'money-icon.svg', href:'/pages/user/opinion'},
    ],
  },

  methods: {
    // 微信退出登录
    weixinLogout: function () {
      app.globalData.userInfo = null;
      // 恢复本页默认数据
      this.setData({
        hasUserInfo: false,
        avatarUrl: "",
        nickName: "",
        plan_describe: '',
        sport: 0,
        vitality: 0,
        sex: 0,
        age: 0,
      });
    },

    // 刷新用户数据函数
    RefreshUserData() {
      if (app.globalData.userInfo != null) {
        this.setData({ 
          hasUserInfo: true,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          nickName : app.globalData.userInfo.nickName,
         });
      }
      let user_ouid = app.globalData.user_ouid
      if (user_ouid) {
        request({ url:"get-user-all?user_ouid="+user_ouid, method:"GET"}).then((res) => {
          if (res.code == '200'){ 
            let userInfo = res.data.user;
            app.setUserAll(userInfo);
            let age = 0
            if (userInfo.birthday != "") {
              age = new Date().getFullYear() - parseInt(userInfo.birthday / 10000)
            }
            this.setData({
              sport: userInfo.athletic_ability_v,
              vitality: userInfo.vitality_v,
              sex: userInfo.sex,
              age: age,
              birthday: userInfo.birthday,
              plan_describe: userInfo.plan_describe,
            });
          }
        })
      }
    },
    weixinLoginTap: function () {
      wx.navigateTo({ url: '/pages/home/index' })
    },
    planTap: function () {
      console.log(this.data.plan_describe)
      if (this.data.plan_describe && this.data.plan_describe.plan_name != "") {
        wx.navigateTo({ url: '/pages/sport/plan' })
      }
      else {
        wx.showToast({
          title: '当前没有开启任何计划',
          icon: 'none'
        });
      }
    },

    jumpView: function (e) {
      let page = e.currentTarget.dataset['index'];
      if (this.data.hasUserInfo) {
        wx.navigateTo({ url: page })
      }
      else {
        this.setData({ showLogin: true });
      }
    },

    editTap: function () {
      let s = this.data.sex == 1 ? 1 : this.data.sex == 2 ? 2 : 1;
      wx.navigateTo({
        url: '/pages/user/profile?first=0&sex=' + s + '&birthday=' + this.data.birthday
      })
    },
    showTips: function () {
      this.setData({ showLogin: true });
    },
    onClose () {
      this.setData({ showLogin: false });
      this.setData({ showExit: false });
    },

    showExit () {
      this.setData({ showExit: true });
    },
    // 授权登录
    authorizedLoginTap (event) {
      wx.getUserProfile({
        desc: '展示用户信息',
        success: resUserProfile => {
          app.setUserInfo(resUserProfile.userInfo);
          wx.login({ success: resWxLogin => {              
            this.wechatLogin(resWxLogin.code)
          }})
        },
      });
    },

    wechatLogin(code){
      if (!code) return
      let data = {
        code: code,
        name: app.globalData.userInfo.nickName,
        avatar: app.globalData.userInfo.avatarUrl,
        phone: '17568914267',
      }
      request({ url:"login/wechat", data:data, method:"POST"}).then((res) => {
        if (res.code == '200'){
          var result = res.data;
          app.setUserAuth(result);
          this.RefreshUserData();
        }
      })
    },
    getPhoneNumber(e) {
      console.log(e.detail.code)
      if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
        wx.showModal({
          title: '提示',
          content: e.detail.errMsg,
          showCancel: false
        })
        return;
      }
    }
    
  },
  lifetimes: {
    ready () {
      this.RefreshUserData();
    }
  },
})