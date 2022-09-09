// pages/user/userinfo.js
const app = getApp();
import { request } from "../../utils/request.js";

import Dialog from '@vant/weapp/dialog/dialog';
Page({
  data: {
    gender: undefined,
    genderArray: [ '男性', '女性'],
    genderIndex: -1,
    userAll: {},
  },

  onShow(){
    console.log("个人页面 显示")
    app.getUserAll().then((res)=>{
      this.setData({
        userAll: app.globalData.userAll,
      })
    });
  },

  onLoad (options) {
    
  },

  logout () {
    Dialog.confirm({
      message: '确认退出账号吗？',
    }).then(() => {
      app.setUserLogout();
      wx.navigateBack();
    }).catch(() => {

    });
  },

  returnHome () {
    wx.navigateBack();
  },

  bindPickerChange: function(e) {
    this.setData({
      genderIndex: e.detail.value,
      gender: this.data.genderArray[e.detail.value]
    })
  },
  
  toPlatformAgreement(){
    wx.navigateTo({
      url: '/pages/user/agreement',
    })
  }
})