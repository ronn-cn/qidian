// pages/order/order.js
import { request } from "../../utils/request.js";
const app = getApp();

Page({
  data: {
    tabs: ['全部', '待支付', '已支付', '售后'],
    activeIndex: 0,
    showOrder:[],
    allOrder:[],      // 全部订单
    unpaidOrder:[],   // 未支付的订单
    paidOrder:[],     // 已支付的订单
    refundOrder:[],   // 退款的订单
    navHeight: 0,      // 导航栏的高度
    scrollViewHeight: 0, 
  },
  // 页面加载时候
  onLoad(options) { 
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
    this.requestOrderList(); // 请求订单列表
  },
  returnHome () {
    wx.navigateBack({ delta: 1 });
  },
  // 请求订单列表
  requestOrderList(){
    request({ url:"get-order-list",data:{"user_ouid":app.globalData.user_ouid}, method:"POST"}).then((res) => {
      if(res.code=='200'){ 
        let list = res.data;
        console.log("订单列表：", list);
        app.globalData.orderList = list;
        this.data.allOrder = [];
        this.data.unpaidOrder = [];
        this.data.paidOrder = [];
        this.data.refundOrder = [];
        if(list.length > 0){
          for(let i = 0; i < list.length; i++){
            if(list[i].status == "C"){
              // 取消了，不能支付了
            } else if(list[i].status == "N"){
              this.data.unpaidOrder.push(list[i])
            } else if(list[i].status == "Y"){
              this.data.paidOrder.push(list[i])
            } else if(list[i].status == "T"){
              this.data.refundOrder.push(list[i])
            }
          }
          this.setData({
            allOrder: list, 
            showOrder: list
          })
        } else {
          // 没有订单
        }
      }
    })
  },
  tabClick: function (e) {
    let index = e.detail.index
    // console.log("Tab点击:", e)
    if(index == 0){
      // 全部订单
      this.setData({
        showOrder: this.data.allOrder
      })
    } else if(index == 1){
      // 待支付
      this.setData({
        showOrder: this.data.unpaidOrder
      })
    } else if(index == 2){
      // 已支付
      this.setData({
        showOrder: this.data.paidOrder
      })
    } else if(index == 3){
      // 售后
      this.setData({
        showOrder: this.data.refundOrder
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
    let params = {
      user_ouid: app.globalData.user_ouid,
      goods_id: parseInt(e.currentTarget.dataset.goodsid),
      store_id: parseInt(e.currentTarget.dataset.storeid)  // 这个是门店ID
    };
    request({ url:"add-order", data:params, method:"POST"}).then((res) => {
      if(res.code=='200'){ 
        console.log("生成订单返回信息：", res)
        wx.requestPayment({
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
  },
  // 订单取消
  orderCancel(e){
    console.log("订单取消：", e);
    let that = this;
    let params = {
      "order_id": parseInt(e.currentTarget.id),
      "user_ouid": app.globalData.user_ouid
    }
    request({ url:"cancel-order", data:params, method:"POST"}).then((res) => {
      if(res.code=='200'){
        that.onLoad(); // 刷新当前页面
      }
    })
  }
})