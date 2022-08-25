// pages/user/vitality.js
const app = getApp();

function addZero(v, size) {
    for (var i = 0, len = size - (v + "").length; i < len; i++) {
        v = "0" + v;
    };
    return v + "";
}

function formatDate(date, formatStr) {
    var arrWeek = ['日', '一', '二', '三', '四', '五', '六'],
        str = formatStr.replace(/yyyy|YYYY/, date.getFullYear()).replace(/yy|YY/, addZero(date.getFullYear() % 100, 2)).replace(/mm|MM/, addZero(date.getMonth() + 1, 2)).replace(/m|M/g, date.getMonth() + 1).replace(/dd|DD/, addZero(date.getDate(), 2)).replace(/d|D/g, date.getDate()).replace(/hh|HH/, addZero(date.getHours(), 2)).replace(/h|H/g, date.getHours()).replace(/ii|II/, addZero(date.getMinutes(), 2)).replace(/i|I/g, date.getMinutes()).replace(/ss|SS/, addZero(date.getSeconds(), 2)).replace(/s|S/g, date.getSeconds()).replace(/w/g, date.getDay()).replace(/W/g, arrWeek[date.getDay()]);
    return str;
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        obj: null,
        TabCur: 0,
        userInfoAll: null,
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
    tabSelect: function (e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
        })
    },

    requestUserData: function () {
        let that = this;
        let userId = that.data.obj.userId;
        if (userId) {
            wx.request({
                url: that.data.obj.svrUrl + 'get-user-all?user_ouid=' + userId,
                success: function (res) {
                    console.log(res.data)
                    if (res.data.code == "200") {
                      var userAll = res.data.data.user;

                        // 时长（单位秒）需转化为分钟
                        let sec = userAll.sport_length
                        let minute = Math.ceil(sec / 60)

                        that.setData({
                            userInfoAll: res.data.data,
                            vitalityValue: userAll.vitality_v,
                            sportLength: minute,
                            sportEnergy: userAll.sport_energy,
                            sportDay: userAll.sport_day,
                            sportCount: userAll.sport_count,
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
                    console.log(res.data);
                    let recordList = [];
                    if (res.data.code == "200" && res.data.data != null) {
                        let arr = res.data.data;
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
                    }
                    that.setData({
                        recordList: recordList
                    });
                }
            })
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
    }
})