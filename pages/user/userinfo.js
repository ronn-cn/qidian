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

  onLoad (options) {
    this.setData({
      userAll: app.globalData.userAll
    })
    console.log('数据信息', this.data.userAll)
  },

  logout () {
    Dialog.confirm({
      message: '确认退出账号吗？',
    }).then(() => {
      app.setLogout();
      wx.navigateBack({ delta: 1 });
    }).catch(() => {
    });
  },

  returnHome () {
    wx.navigateBack({
      delta: 1
    });
  },

  bindPickerChange: function(e) {
    this.setData({
      genderIndex: e.detail.value,
      gender: this.data.genderArray[e.detail.value]
    })
  },
})