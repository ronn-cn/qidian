// pages/user/plan.js
const app = getApp();
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    // 开启课程按钮
    startLessonTap: function () {
        wx.showToast({
            title: '请到健身镜开启课程训练！',
            icon: 'none'
        })
    },
    requestUserData: function () {
        let that = this;
        let userId = that.data.obj.userId;
        if (userId) {
            wx.request({
                url: that.data.obj.svrUrl + 'get-user-all?user_ouid=' + userId+"&time="+new Date().getTime(),
                success: function (res) {
                    if (res.data.code == "200") {
                        let userAll = res.data.data.user
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
                        that.setData({
                            userInfoAll: userAll,
                            planName: plan.plan_name,
                            stageName:plan.stage_name,
                            factor:plan.factor,
                            condition:plan.condition,
                            steps: stepsTmp,
                            active:plan.stage_index,
                            planDes:planDes
                        });
                        
                    }
                }
            })

            wx.request({
              url: that.data.obj.svrUrl + 'get-sport-log',
              method: "POST",
              data: {
                  "user_ouid": userId
                  // "user_ouid": "a3bbbc4d009df04ad843af4c8421466ecf3e8926a4b72c92db384e3b948bf2a8"
              },
              success: function (res) {
                let spotArr = [];
                let recordList =[];
                // spotArkr
                  if (res.data.code == "200" && res.data.data != null) {
                    let arr = res.data.data;
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

                    that.setData({
                      spotArr : spotArr,
                      recordList: recordList
                    })
                  }
                }
              });
        }
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