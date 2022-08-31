// pages/user/plan.js
const app = getApp();
import { request } from "../../utils/request.js";

const positionJSON = {
    "endurance": "耐力",
    "power": "力量",
    "control": "控制",
    "balance": "平衡",
    "flexibility": "柔韧",
    "shoulder": "肩部",
    "arm": "臂部",
    "back": "背部",
    "chest": "胸部",
    "abdominal": "腹部",
    "hip": "臀部",
    "leg": "腿部",
    "muscle": "增肌",
    "fat": "减脂",
}

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
      bgColor:true,
      obj: null,
      planName: "",
      planDes:"",
      stageName:"",
      factor:"",
      condition:[],

      steps:[{},{},{},{}],
      active:0,

      spotArr: [],
      recordList: [],

      position: "暂无",
      positionStatus: -1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.netName == "evinf") {
            this.data.obj = app.globalData.ev;
        } else {
            this.data.obj = app.globalData.sg;
        }
        this.requestUserData();
    },

    // 开启课程按钮
    startLessonTap: function () {
        wx.showToast({
            title: '请到健身镜开启课程训练！',
            icon: 'none'
        })
    },
    requestUserData: function () {
      let userAll = app.globalData.userAll
      let plan = userAll.plan_describe
      let planDes = JSON.parse(userAll.plan).desc
      let stepsTmp = []
      let count = plan.stage_count

      for (let i = 0; i<count; i++){
        let item = {
          inactiveIcon: 'star',
          activeIcon: 'star',
        }
        stepsTmp.push(item)
      }

      console.log("计划",plan);
      this.setData({
          userInfoAll: userAll,
          planName: plan.plan_name,
          stageName:plan.stage_name,
          factor:plan.factor,
          condition:plan.condition,
          steps: stepsTmp,
          active:plan.stage_index,
          planDes:planDes
      });
      
      let requestData = {
        "user_ouid": app.globalData.user_ouid
      }
      request({ url:"get-sport-log", data:requestData, method:"POST"}).then((res) => {
        let spotArr = [];
        let recordList =[];
        if (res.code == "200"){
          let arr = res.data;
          let i = 0;
          for (const key in arr) {
            let record = arr[key];
            if (new Date(record.date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)){
              let m = parseInt(record.time / 60);
              let s = parseInt(record.time % 60);
              let item = {
                title: record.name,
                duration: addZero(m, 2) + "′" + addZero(s, 2) + "″",
              }
              recordList.push(item)
            }
            spotArr.push(record.date)
          }

          this.setData({
            spotArr : spotArr,
            recordList: recordList
          })
        }
      })
    },

    /**
     * 页面滚动
     */
    onPageScroll: function (e) {
      let flag = e.scrollTop <= 0;
      this.setData({
        bgColor: flag
      })
    },
    returnHome(){
      wx.navigateBack({
        delta: 1
      });
    },
})