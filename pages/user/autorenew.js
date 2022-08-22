// pages/user/autorenew.js
Page({
  data: {
    isAuto : false,
    renewInfo:{
      type: '奇点运动月卡（自动续费）',
      price: 99,
      date: '2022-08-30'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  returnHome () {
    wx.navigateBack({ delta: 1 });
  },
})