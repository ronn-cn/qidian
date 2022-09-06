// pages/user/openMember.js
const app = getApp();
import { request } from "../../utils/request.js";
import { formatDate } from "../../utils/util.js"
Page({
  data: {
    checked: false,
    display:[
      {text:'7*24h营业',des:'想练就练，全天不打烊',icon:'/images/home/24hour.svg'},
      {text:'智能器械免费用',des:'器械使用次数不限',icon:'/images/home/equ.svg'},
      {text:'专属训练计划',des:'基于能力，量身定制',icon:'/images/home/plan.svg'},
      {text:'海量课程种类',des:'多种分类，练到嗨',icon:'/images/home/type.svg'},
    ],
    goods: [],
    currentIndex:0,
    price: 0,
    showTip: false,
    scrollViewHeight: 0,
    memberType:'',
    endTime:'',
    store:{},   // 门店
  },

  returnHome(){
    wx.navigateBack({ delta: 1 });
  },

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
    var screenHeight = wx.getSystemInfoSync().windowHeight
    let that = this
    // 获取navbar的高度
    let query = wx.createSelectorQuery();
    query.select('.nav-bar').boundingClientRect(navRect=>{
      let query2 = wx.createSelectorQuery();
      query2.select('.footer').boundingClientRect(tabRect=>{
        that.setData({
          scrollViewHeight: screenHeight - navRect.height - tabRect.height,
        })
        console.log(that.data.scrollViewHeight)
      }).exec();
    }).exec();

    request({ url:"get-goods-list", method:"POST"}).then((res) => {
      if(res.code=='200'){
        console.log("商品列表", res.data)
        let goods = res.data
        let price = goods.length > 0 ? goods[0].money : 0
        that.setData({
          goods: res.data,
          price: price * 100
        })
      }
    })

    let userInfo = app.globalData.userAll
    if (userInfo){
      if (userInfo.member_detail){
        this.setData({
          memberType: userInfo.member_detail.member_type + "会员",
          endTime:formatDate(userInfo.member_detail.member_end_time)
        })
      } else {
        this.setData({
          memberType: '',
          endTime:''
        })
      }
    }

    this.setData({
      store: app.globalData.userAll.store
    })
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

  onChange(event) {
    this.setData({
      checked: event.detail
    });
    if (this.data.checked){
      this.setData({
        showTip: false
      })
    }
  },

  submit(){
    // 检测是否同意会员协议
    if(!this.data.checked){
      this.setData({
        showTip: true
      })
      return
    }
    console.log('提交订单')
    let goodid = this.data.goods[this.data.currentIndex].id
    let userid = app.globalData.user_ouid
    let data={
      user_ouid: userid,
      goods_id: goodid,
      store_id : 1
    };
    request({ url:"add-order", data:data, method:"POST"}).then((res) => {
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
              console.log("调起支付成功")
            },
            "fail":function(res){
              console.log("调起支付失败")
              wx.navigateTo({
                url: '/pages/order/order',
              })
            },
            "complete":function(res){
              console.log("调起支付完成")
            }
          })
        }
      })
  },

  swipclick(e){
    let index = e.currentTarget.dataset['index'];
    let price = this.data.goods[index].money
    this.setData({ currentIndex : index, price:price*100})
  }
})