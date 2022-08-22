// pages/user/openMember.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display:[
      {text:'7*24h营业',des:'想练就练，全天不打烊',icon:'/images/home/24hour.svg'},
      {text:'智能器械免费用',des:'器械使用次数不限',icon:'/images/home/equ.svg'},
      {text:'专属训练计划',des:'基于能力，量身定制',icon:'/images/home/plan.svg'},
      {text:'海量课程种类',des:'多种分类，练到嗨',icon:'/images/home/type.svg'},
    ]
  },

  returnHome(){
    wx.navigateBack({
      delta: 1
    });
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})