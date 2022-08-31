// components/user/index.js
const app = getApp();
import { request } from "../../utils/request.js";
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
    member:null,

    showLogin: false,
    plan_describe: '',
    menuList:[
      {name:'个人信息', icon:'user-icon.svg', href:'/pages/user/userinfo'},
      {name:'我的订单', icon:'order-icon.svg', href:'/pages/order/order'},
      {name:'会员卡兑换', icon:'exchange-icon.svg', href:'/pages/member/exchange'},
      {name:'我的优惠券', icon:'coupon-icon.svg', href:'/pages/order/coupon'},
      // {name:'自动续费管理', icon:'money-icon.svg', href:'/pages/member/autorenew'},
      {name:'意见反馈', icon:'money-icon.svg', href:'/pages/user/opinion'},
    ],
  },

  methods: {
    // 刷新用户数据函数
    RefreshUserData() {
      if (app.globalData.userAll){
        let userInfo = app.globalData.userAll;
        let age = 0
        if (userInfo.birthday != "") {
          age = new Date().getFullYear() - parseInt(userInfo.birthday / 10000)
        }
        let member = app.globalData.member
        this.setData({
          sport: userInfo.athletic_ability_v,
          vitality: userInfo.vitality_v,
          sex: userInfo.sex,
          age: age,
          birthday: userInfo.birthday,
          plan_describe: userInfo.plan_describe,
          hasUserInfo: true,
          avatarUrl: userInfo.avatar,
          nickName : userInfo.name,
          member: member
        });
      }else 
        this.clearShowInfo()
    },
    clearShowInfo(){
      this.setData({
        hasUserInfo: false,
        avatarUrl: "",
        nickName: "",
        plan_describe: '',
        sport: 0,
        vitality: 0,
        sex: 0,
        age: 0,
        member:null
      });
    },
    OpenMember(){
      this.triggerEvent("OpenMember", 'user');
    },
   
    planTap() {
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

    jumpView(e) {
      let page = e.currentTarget.dataset['index'];
      if (this.data.hasUserInfo) {
        wx.navigateTo({ url: page })
      }
      else {
        this.setData({ showLogin: true });
      }
    },

    editTap() {
      let s = this.data.sex == 1 ? 1 : this.data.sex == 2 ? 2 : 1;
      wx.navigateTo({
        url: '/pages/user/profile?first=0&sex=' + s + '&birthday=' + this.data.birthday
      })
    },
    showTips() {
      this.setData({ showLogin: true });
    },
    onClose () {
      this.setData({ showLogin: false });
      this.setData({ showExit: false });
    },

    showExit () {
      this.setData({ showExit: true });
    },

    wechatLogin(){
      this.triggerEvent("authorizedLoginTap", 'user');
    }
  },
  lifetimes: {
    ready () {
      this.RefreshUserData();
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      this.RefreshUserData();
    },
  },
})