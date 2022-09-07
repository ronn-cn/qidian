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
    console.log("显示")
    let user_ouid = app.globalData.user_ouid
    request({ url:"get-user-all?user_ouid="+user_ouid, method:"GET"}).then((res) => {
      if (res.code == '200') 
        app.setUserAll(res.data.user);
        this.setData({
          userAll: app.globalData.userAll,
        })
    })
  },

  onLoad (options) {
    
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
  toPlatformAgreement(){
    wx.navigateTo({
      url: '/pages/user/agreement',
    })
  }
})