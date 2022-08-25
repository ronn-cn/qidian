// pages/user/openMember.js
const app = getApp();
import { request } from "../../utils/request.js";
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
    obj:null,
    price: 0,
  },

  returnHome(){
    wx.navigateBack({ delta: 1 });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let obj = app.globalData.ev
    this.setData({obj: obj})
    let that = this
    request({ url:"get-goods-list", method:"POST"}).then((res) => {
      if(res.code=='200'){ 
        let goods = res.data
        let price = goods.length > 0 ? goods[0].money : 0
        that.setData({
          goods: res.data,
          price: price * 100
        })
      }
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
      checked: event.detail,
    });
  },

  submit(){
    console.log('提交订单')
    let goodid = this.data.goods[this.data.currentIndex].id
    let userid = this.data.obj.userId

    let data={
      user_ouid: userid,
      goods_id: goodid,
      store_id : 1
    };
    request({ url:"add-order", data:data, method:"POST"}).then((res) => {
      if(res.code=='200'){ 
      }
    })
  },

  swipclick(e){
    let index = e.currentTarget.dataset['index'];
    let price = this.data.goods[index].money
    this.setData({ currentIndex : index, price:price*100})
  }
})