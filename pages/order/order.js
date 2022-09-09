// pages/order/order.js
import { request } from "../../utils/request.js";
const app = getApp();

Page({
  data: {
    tabs: ['全部', '待支付', '已支付'], //去掉了售后
    activeIndex: 0,
    showOrder:[],
    order:[],      // 全部订单
    navHeight: 0,      // 导航栏的高度
    scrollViewHeight: 0, 
  },
  // 页面加载时候
  onLoad(options) { 
    this.calculatePageHeight() // 计算页面高度
    this.requestOrderList(); // 请求订单列表
  },
  // 计算页面高度
  calculatePageHeight(){
    var screenHeight = wx.getSystemInfoSync().windowHeight
    let that = this
    // 获取导航栏高度
    let query = wx.createSelectorQuery();
    query.select('.nav-bar').boundingClientRect(navRect=>{
      that.setData({
        navHeight: navRect.height,
      })
      let query2 = wx.createSelectorQuery();
      query2.select('.nav-tab').boundingClientRect(navtabRect=>{
        that.setData({
          scrollViewHeight: screenHeight - navRect.height - navtabRect.height,
        })
      }).exec();
    }).exec();
  },
  returnHome () {
    wx.navigateBack({ delta: 1 });
  },
  // 请求订单列表
  requestOrderList(){
    let user_ouid = app.globalData.userAuth?app.globalData.userAuth.user_ouid:'';
    if (!user_ouid) return
    request({ url:"get-order-list",data:{"user_ouid":user_ouid}, method:"POST"}).then((res) => {
      if(res.code=='200'){ 
        let list = res.data;
        console.log("订单列表：", list);
        app.globalData.orderList = list.all;
        this.data.order = list;
        this.setData({
          showOrder: this.data.order.all?this.data.order.all:[]
        })
      }
    })
  },
  tabClick: function (e) {
    let index = e.detail.index
    // console.log("Tab点击:", e)
    if(index == 0){
      // 全部订单
      this.setData({
        showOrder: this.data.order.all?this.data.order.all:[]
      })
    } else if(index == 1){
      // 待支付
      this.setData({
        showOrder: this.data.order.pay_wait?this.data.order.pay_wait:[]
      })
    } else if(index == 2){
      // 已支付
      this.setData({
        showOrder: this.data.order.pay_success?this.data.order.pay_success:[]
      })
    } else if(index == 3){
      // 售后
      this.setData({
        showOrder: this.data.order.pay_refund?this.data.order.pay_refund:[]
      })
    }
  },
  orderDetail(e){
    console.log("点击订单", e);
    //订单详情
    wx.navigateTo({
      url: '/pages/order/orderDetail?id=' + e.currentTarget.id
    })
  },
  // 订单支付
  orderPay(e){
    console.log("订单支付：", e);
    let that = this;
    let orders = app.globalData.orderList
    orders.forEach(function(order) {
      console.log(order);
      if(order.id == e.currentTarget.dataset.id){
        let payInfo = JSON.parse(order.per_pay) // 支付信息
        wx.requestPayment({
          "timeStamp": payInfo.timeStamp,
          "nonceStr": payInfo.nonceStr,
          "package": payInfo.package,
          "signType": payInfo.signType,
          "paySign": payInfo.paySign,
          "success":function(res){
            console.log("调起支付成功: ", res)
            // 支付成功刷新
            that.onLoad()
          },
          "fail":function(res){
            console.log("调起支付失败: ", res)
          },
          "complete":function(res){
            console.log("调起支付完成: ", res)
          }
        })
      }
    });
  },
  // 订单取消
  orderCancel(e){
    console.log("订单取消：", e);
    let that = this;
    let params = {
      "order_id": parseInt(e.currentTarget.id),
      "user_ouid": app.globalData.userAuth.user_ouid
    }
    request({ url:"cancel-order", data:params, method:"POST"}).then((res) => {
      if(res.code=='200'){
        that.onLoad(); // 刷新当前页面
      }
    })
  }
})