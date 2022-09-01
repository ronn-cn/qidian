// pages/store/store.js
Page({
  data: {
    option1: [
      { text: '青岛市', value: 0 },
      { text: '北京市', value: 1 },
    ],
    option2: [
      { text: '黄岛区', value: 'a' },
      { text: '崂山区', value: 'b' },
    ],
    value1: 0,
    value2: 'a',
  },
  onLoad(options) {

  },

  onShow() {

  },

  returnHome(){
    wx.navigateBack({ delta: 1 });
  }
})