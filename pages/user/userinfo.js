// pages/user/userinfo.js
const app = getApp();
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender: undefined,
    genderArray: [ '男性', '女性'],
    genderIndex: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  logout () {
    Dialog.confirm({
      message: '确认退出账号吗？',
    }).then(() => {
      // on confirm
      this.weixinLogout()
      wx.navigateBack({
        delta: 1
      });
    }).catch(() => {
      // on cancel
    });
  },

  returnHome () {
    wx.navigateBack({
      delta: 1
    });
  },

  // 微信退出登录
  weixinLogout () {
    app.globalData.userInfo = null;
    wx.removeStorageSync('userInfo');
    app.globalData.ev = {
      userId: "",
      userJWT: "",
      userAll: null,
      // svrUrl: "https://sport.evinf.cn/",
      svrUrl: "https://sport1.evinf.cn/",
    }
    wx.removeStorageSync('ev');
    app.globalData.sg = {
      userId: "",
      userJWT: "",
      userAll: null,
      svrUrl: "https://sport.sportguider.com/",
    }
    wx.removeStorageSync('sg');
  },

  bindPickerChange: function(e) {
    this.setData({
      genderIndex: e.detail.value,
      gender: this.data.genderArray[e.detail.value]
    })
  },
})