// pages/user/exchange.js
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    show: false,
    showStore: false,
    actions: [
      { name: '奇点运动实体卡' },
      { name: '奇点运动体验劵' },
      { name: '美团/大众点评' },
    ],

    source: '',
    cdk: '11',
    store: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {

  },

  showSheet () {
    console.log('data', this.data.show)
    this.setData({ show: true });
  },

  onSelect (event) {
    console.log(event.detail.name);
    this.setData({ source: event.detail.name })
  },

  onClose () {
    this.setData({ show: false });
  },

  showStore () {
    this.setData({ showStore: true });
  },

  onCloseStore () {
    this.setData({ showStore: false });
  },

  chooseStore () {
    this.setData(
      {
        showStore: false,
        store: '奇点运动黄岛一店'
      });
    console.log('data', this.data.store)
  },

  //兑换
  exchange () {
    Toast.success('兑换成功');
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      });
    }, 1500)
  },

  returnHome () {
    wx.navigateBack({
      delta: 1
    });
  },


})