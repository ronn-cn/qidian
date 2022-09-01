// pages/user/opinion.js
const app = getApp();
import { request } from "../../utils/request.js";

Page({
  data: {
    autosize: {
      minHeight: 100,
      content:''
    }
  },

  returnHome(){
    wx.navigateBack({ delta: 1 });
  },

  submit(){
    if (this.data.content){
      let data ={
        user_ouid:app.globalData.user_ouid,
        text: this.data.content
      }
      request({ url:"feedback", data:data,method:"POST"}).then((res) => {
        if (res.code == '200'){
          wx.showToast({
            title: '提交反馈成功',
            icon: 'error',
          });
        }
      })
    }
    else{
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'error',
      });
    }
  }
})