// pages/user/coupon.js
const util = require('../../utils/util.js');
import { request } from "../../utils/request.js";
const app = getApp();

Page({
  data: {
    tabs: ['未使用', '已使用', '已过期'],
    activeIndex: 0,
    coupons:[],
    showCoupons:[],
  },
  onLoad(options) {
    request({ url:"get-user-coupons",data:{"user_ouid":app.globalData.user_ouid}, method:"POST"}).then((res) => {
      if (res.code == '200'){
        this.setData({
          coupons: res.data,
          showCoupons: res.data.unused
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  returnHome () {
    wx.navigateBack({ delta: 1 });
  },

  tabClick: function (e) {
    let tmp  = []
    let index = e.detail.index
    if (index == 0) {
      tmp = this.data.coupons.unused
    }
    else if (index == 1) {
      tmp = this.data.coupons.finish
    }
    else if (index == 2) {
      tmp = this.data.coupons.expire
    }
    if (!tmp) tmp = []
    this.setData({
      showCoupons:tmp,
      activeIndex: e.detail.index
    })
    console.log("111", this.data.showCoupons)
  },
})