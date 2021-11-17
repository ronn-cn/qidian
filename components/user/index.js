// components/user/index.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    options: {
        addGlobalClass: true,
    },

    /**
     * 组件的初始数据
     */
    data: {
        obj: null,
        planId: "",
        sportScore: 0,
        vitalityScore: 0,
        starNumber: 0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        weixinLoginTap: function () {
            this.triggerEvent('weixinLoginTap');
        },
        // 微信退出登录
        weixinLogout: function () {
            this.setData({
                sportScore: 0,
                vitalityScore: 0,
                starNumber: 0
            });
            if (app.globalData.netName == "evinf") {
                app.globalData.ev={
                    userInfo: null,
                    hasUserInfo: false,
                    userId:"",
                    userName:"",
                    userAvatar:"",
                    userJWT:"",
                    svrUrl: "https://sport.evinf.cn/",
                }
                wx.removeStorageSync('ev');
                this.setData({
                    obj: app.globalData.ev
                });
            } else {
                app.globalData.sg={
                    userInfo: null,
                    hasUserInfo: false,
                    userId:"",
                    userName:"",
                    userAvatar:"",
                    userJWT:"",
                    svrUrl: "https://sport.sportguider.com/",
                }
                wx.removeStorageSync('sg');
                this.setData({
                    obj: app.globalData.sg
                });
            }
        },

        requestUserData: function () {
            let that = this;
            let userId = that.data.obj.userId;
            if (userId) {
                wx.request({
                    url: that.data.obj.svrUrl + 'get-user-all?user_id=' + userId,
                    success: function (res) {
                        console.log(res.data)
                        if (res.data.code == "200") {
                            that.setData({
                                planId: res.data.data.data.user_plan_id,
                                sportScore: res.data.data.data.sport_power,
                                vitalityScore: res.data.data.data.life_power,
                                starNumber: res.data.data.total.star_count
                            });
                        }
                    }
                })
            }
        },
        // 刷新用户数据函数
        RefreshUserData: function () {
            if (app.globalData.netName == "evinf"){
                this.setData({
                    obj: app.globalData.ev
                });
            } else {
                this.setData({
                    obj: app.globalData.sg
                });
            }
            this.requestUserData();
        },
        planTap: function () {
            this.triggerEvent('planTap', this.data.planId);
        },
        vitalityTap: function () {
            this.triggerEvent('vitalityTap');
        },
        sportTap: function () {
            this.triggerEvent('sportTap');
        }
    },

    lifetimes: {
        ready() {
            this.RefreshUserData();
        }
    }
})