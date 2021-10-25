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
        userInfo: {},
        hasUserInfo: false,
        sportScore:0,
        vitalityScore:0,
        starNumber:0,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        weixinLoginTap: function(){
            this.triggerEvent('weixinLoginTap');
        },
        // 微信退出登录
        weixinLogout: function(){
            this.setData({
                userInfo: null,
                hasUserInfo: false,
                sportScore: 0,
                vitalityScore: 0,
                starNumber: 0
            });
            app.globalData.userInfo = null;
            app.globalData.hasUserInfo = false;
            wx.removeStorageSync('user_info');
            wx.removeStorageSync('user_id');
            wx.removeStorageSync('user_jwt');
        },

        requestUserData: function(){
            let that = this;
            let userId = wx.getStorageSync('user_id');
            if (userId){
                wx.request({
                  url: 'https://sport.sportguider.com/get-user-all?user_id='+userId,
                  success: function(res) {
                    console.log(res.data)
                    if (res.data.code == "200"){
                        that.setData({
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
        RefreshUserData: function(){
            if (!app.globalData.userInfo){
                let userInfo = wx.getStorageSync('user_info');
                console.log("userInfo:", userInfo);
                if (userInfo){
                    app.globalData.userInfo = userInfo;
                    app.globalData.hasUserInfo = true;
                }
            }
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: app.globalData.hasUserInfo
            })
            this.requestUserData();
        }
    },

    lifetimes:{
        ready(){
            this.RefreshUserData();
          }
      }
})
