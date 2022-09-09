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
    scrollViewHeight: 0, 
  },
  onLoad(options) {
    this.calculatePageHeight();
    this.getUserCoupons();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  // 计算页面高度
  calculatePageHeight(){
    var screenHeight = wx.getSystemInfoSync().windowHeight
    let that = this
    // 获取导航栏高度
    let query = wx.createSelectorQuery();
    query.select('.nav-bar').boundingClientRect(navRect=>{
      that.setData({
        navHeight: navRect.height,
      })
      let query2 = wx.createSelectorQuery();
      query2.select('.nav-tab').boundingClientRect(navtabRect=>{
        that.setData({
          scrollViewHeight: screenHeight - navRect.height - navtabRect.height,
        })
      }).exec();
    }).exec();
  },
  getUserCoupons(){
    let user_ouid = app.globalData.userAuth?app.globalData.userAuth.user_ouid:'';
    if (!user_ouid) return
    request({ url:"get-user-coupons",data:{"user_ouid":user_ouid}, method:"POST"}).then((res) => {
      if (res.code == '200'){
        console.log("获取优惠券：", res.data)
        this.setData({
          coupons: res.data,
          showCoupons: res.data.unused?res.data.unused:[]
        })
      }
    })
  },

  returnHome () {
    wx.navigateBack();
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
  },
  // 使用优惠券
  clipCoupon: function(e){
    console.log(e)
    if (this.data.activeIndex != 0){ return; }
    
    if (e.currentTarget.dataset.id){
      // 可以使用,带着优惠券的参数
      wx.navigateTo({
        url: '/pages/member/openMember?coupons_id='+e.currentTarget.dataset.id,
      })
    } else {
    wx.navigateTo({
      url: '/pages/member/openMember',
    })
    }
  }
})