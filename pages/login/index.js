// pages/login/index.js

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        deviceOuid:"",
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let user_id = wx.getStorageSync('user_id');
        if (!user_id) {
            // 登录
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (res.code) {
                        wx.request({
                            url: app.globalData.svrUrl + 'login/wechat',
                            method: "POST",
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            data: {
                                code: res.code,
                            },
                            success: res2 => {
                                console.log(res2);
                                if (res2.statusCode == 200 && res2.data.code == "200") {
                                    var result = res2.data.data;
                                    // 返回值正确
                                    wx.setStorageSync('user_id', result.user_id);
                                    wx.setStorageSync('user_jwt', result.user_jwt);
                                } else {
                                    // 返回值不正确
                                    wx.showToast({
                                        title: 'OpenId未获取',
                                        duration: 1000,
                                    })
                                }
                            },
                            fail: res2 => {
                                console.log(res2);
                                wx.showToast({
                                    title: 'OpenId获取失败',
                                    duration: 1000,
                                })
                            }
                        });
                    } else {
                        wx.showToast({
                            title: '未获取到代码',
                            duration: 1000,
                        })
                    }
                },
                fail: res => {
                    // 失败返回
                    console.log(res);
                    wx.showToast({
                        title: '微信登录失败',
                        duration: 1000,
                    })
                }
            })
        }

        function getQueryVariable(url,variable){
            let arr = url.split("?");
            let query = "";
            if (arr.length > 1){
               query = arr[1]; 
               let vars = query.split("&");
               for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){
                        return pair[1];
                    }
               }
            }
            return(false);
        }

        if (options.ouid) {
            this.setData({
                deviceOuid: options.ouid
            });
            console.log(this.data.deviceOuid);
            // TODO： 这里可以查询设备名称，或者设备编号，或者通过参数扫码传递过来
        } else {
            let url = decodeURIComponent(options.q);
            let id = getQueryVariable(url,"ouid");
            this.setData({
                deviceOuid: id
            });
            console.log(id);
        }
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

    // 返回主页
    btnBack: function () {
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },

    //登录到设备
    loginDevice: function () {
        if (!app.globalData.userInfo) {
            let userInfo = wx.getStorageSync('user_info');
            if (userInfo) {
                app.globalData.userInfo = userInfo;
                app.globalData.hasUserInfo = true;
            }
        }

        if (app.globalData.hasUserInfo) {
            // 请求登陆到设备
            wx.request({
                url: app.globalData.svrUrl + 'login/device',
                method: "POST",
                header: {
                    "content-type": "application/json"
                },
                data: {
                    "device_id": this.data.deviceOuid,
                    "user_id": wx.getStorageSync('user_id'),
                    "user_jwt": wx.getStorageSync('user_jwt'),
                    "user_name": app.globalData.userInfo.nickName,
                    "user_avatar": app.globalData.userInfo.avatarUrl,
                    "user_sex": app.globalData.userInfo.gender,
                    "user_info": app.globalData.userInfo
                },
                success: res2 => {
                    console.log(res2);
                    if (res2.statusCode == 200 && res2.data.code == "200") {
                        wx.showToast({
                            title: '登录成功',
                            duration: 1000,
                            success: function () {
                                setTimeout(function () {
                                    let pages = getCurrentPages();
                                    if (pages.length > 1) {
                                        wx.navigateBack({
                                            delta: 1 // 返回上一级页面
                                        })
                                    } else {
                                        wx.reLaunch({
                                            url: '/pages/index/index'
                                        })
                                    }
                                }, 1000)
                            },
                        })
                    } else {
                        // 不正确
                        wx.showToast({
                            title: "未成功登录",
                            duration: 1000,
                        })
                    }
                },
                fail: res2 => {
                    console.log(res2);
                    wx.showToast({
                        title: '登录失败',
                        duration: 1000,
                    })
                }
            })
        } else {
            // 没有用户信息，自己获取
            wx.getUserProfile({
                desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    app.globalData.userInfo = res.userInfo;
                    app.globalData.hasUserInfo = true;
                    wx.setStorageSync('user_info', res.userInfo);
                }
            })
        }
    }
})