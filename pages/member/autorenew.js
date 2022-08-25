// pages/user/autorenew.js
// 自动续费
Page({
  data: {
    isAuto : false,
    renewInfo:{
      type: '奇点运动月卡（自动续费）',
      price: 99,
      date: '2022-08-30'
    }
  },

  onLoad(options) {

  }, 
  returnHome () {
    wx.navigateBack({ delta: 1 });
  },

  exchange(){
    // wx.navigateTo({ url: '/pages/user/openMember' })
    console.log('开通自动续费')
  }
})