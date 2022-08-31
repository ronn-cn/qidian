// pages/user/vitality.js
const app = getApp();
import { request } from "../../utils/request.js";

function addZero(v, size) {
    for (var i = 0, len = size - (v + "").length; i < len; i++) {
        v = "0" + v;
    };
    return v + "";
}

Page({
    /**
     * 页面的初始数据
     */
    data: {
        TabCur: 0,
        vitalityValue: 0,           //活力值
        sportLength: 0,             //总运动时长
        sportEnergy: 0,             //总运动消耗
        sportDay: 0,                //总运动天数
        sportCount: 0,              //总运动次数
        sportRecord: null,
        recordList: [],
        bgColor: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestUserData();
    },

    tabSelect: function (e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
        })
    },

    requestUserData: function () {
      var userAll = app.globalData.userAll;
      // 时长（单位秒）需转化为分钟
      let sec = userAll.sport_length
      let minute = Math.ceil(sec / 60)
      this.setData({
          vitalityValue: userAll.vitality_v,
          sportLength: minute,
          sportEnergy: userAll.sport_energy,
          sportDay: userAll.sport_day,
          sportCount: userAll.sport_count,
      });
      let requestData = { "user_ouid": app.globalData.user_ouid }
      request({ url:"get-sport-log", data:requestData, method:"POST"}).then((res) => {
        if (res.code == '200'){
          let recordList = [];
          let arr = res.data;
          let i = 0;
          for (const key in arr) {
              if (i >= 10) {
                  break;
              }
              let record = arr[key];
              // 判断时间戳的长度
              let m = parseInt(record.time / 60);
              let s = parseInt(record.time % 60);
              let item = {
                  title: record.name,
                  duration: addZero(m, 2) + "′" + addZero(s, 2) + "″",
              }
              recordList.push(item);
              i++;
          }
          this.setData({
              recordList: recordList
          });
        }
      })
    },

    onPageScroll: function (e) {
      let flag = e.scrollTop <= 0;
      this.setData({
        bgColor: flag
      })
    },
    returnHome(){
      wx.navigateBack({ delta: 1 });
    }
})