// pages/user/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    display:[
      {name:'订单号', value:'202208081704151531521'},
      {name:'下单时间', value: '2022/08/08 16:45'},
      {name:'商品总价', value: '¥ 99'},
      {name:'平台优惠', value: '-¥ 0.00'},
      {name:'实付款', value: '¥ 99'},
    ],
    list: ['a', 'b', 'c'],
    result: ['a', 'b'],
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
  return(){
    wx.navigateBack({ delta: 1 })
  },

  refund(){
    this.setData({show: true})
  },
  onChange(event) {
    this.setData({
      result: event.detail,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
})