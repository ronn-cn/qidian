// pages/user/orderDetail.js
import { request } from "../../utils/request.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    list: ['a', 'b', 'c'],
    result: ['a', 'b'],
    order: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("订单详情：", options)
    for(let i=0;i<app.globalData.orderList.length;i++){
      if(app.globalData.orderList[i].id == options.id){
        console.log(app.globalData.orderList[i])
        this.setData({
          order: app.globalData.orderList[i]
        })
      }
    }
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

  // 退款
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
  // 取消订单
  orderCancel(e) {
    let params = {
      "order_id": parseInt(e.currentTarget.id),
      "user_ouid": app.globalData.user_ouid
    }
    request({ url:"cancel-order", data:params, method:"POST"}).then((res) => {
      if(res.code=='200'){
        wx.redirectTo({url:"/pages/order/order"})
        // wx.navigateBack({ delta: 1 });
      }
    })
  },
  // 继续支付
  orderPay(){
    let params = {
      user_ouid: app.globalData.user_ouid,
      goods_id: this.data.order.goods_id,
      store_id : this.data.order.store_id  // 这个是门店ID
    };
    request({ url:"add-order", data:params, method:"POST"}).then((res) => {
      if(res.code=='200'){ 
        console.log("生成订单返回信息：", res)
        wx.requestPayment(
          {
            "timeStamp": res.data.per_pay.timeStamp,
            "nonceStr": res.data.per_pay.nonceStr,
            "package": res.data.per_pay.package,
            "signType": res.data.per_pay.signType,
            "paySign": res.data.per_pay.paySign,
            "success":function(res){
              console.log("调起支付成功: ", res)
            },
            "fail":function(res){
              console.log("调起支付失败: ", res)
            },
            "complete":function(res){
              console.log("调起支付完成: ", res)
            }
          })
        }
      })
  }
})