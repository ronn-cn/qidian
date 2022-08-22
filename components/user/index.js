// components/user/index.js
const app = getApp();
var authMark = false;
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
    hasUserInfo: false,
    avatarUrl: "",
    nickName: "",
    obj: null,
    sport: 0,
    vitality: 0,
    sex: 0,
    age: 0,

    showLogin: false,
    plan_describe: '',
    menuList:[
      {name:'个人信息', icon:'user-icon.svg', href:'userinfo'},
      {name:'我的订单', icon:'order-icon.svg', href:'toUserinfo'},
      {name:'会员卡兑换', icon:'exchange-icon.svg', href:'exchange'},
      {name:'我的优惠券', icon:'coupon-icon.svg', href:'coupon'},
      {name:'自动续费管理', icon:'money-icon.svg', href:'autorenew'},
      {name:'意见反馈', icon:'money-icon.svg', href:'opinion'},
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 恢复默认数据
    restoreDefaultData: function () {
      this.setData({
        hasUserInfo: false,
        avatarUrl: "",
        nickName: "",
        obj: null,
        plan_describe: '',
        sport: 0,
        vitality: 0,
        sex: 0,
        age: 0,
        
      });
    },
    // 微信退出登录
    weixinLogout: function () {
      app.globalData.userInfo = null;
      wx.removeStorageSync('userInfo');
      app.globalData.ev = {
        userId: "",
        userJWT: "",
        userAll: null,
        // svrUrl: "https://sport.evinf.cn/",
        svrUrl: "https://sport1.evinf.cn/",
      }
      wx.removeStorageSync('ev');
      app.globalData.sg = {
        userId: "",
        userJWT: "",
        userAll: null,
        svrUrl: "https://sport.sportguider.com/",
      }
      wx.removeStorageSync('sg');

      // 恢复本页默认数据，跳转登录授权页面
      this.restoreDefaultData();
    },

    requestUserData: function () {
      let userId,svrUrl
      if (this.data.obj){
        userId = this.data.obj.userId;
        svrUrl = this.data.obj.svrUrl;
      }
      // 判断存在用户信息
      if (userId != "") {
        wx.request({
          url: svrUrl + 'get-user-all?user_ouid=' + userId,
          success: res => {
            if (res.data.code == "200") {
              let userInfo = res.data.data.user;
              console.log("登录数据", userInfo)
              app.setUserAll(userInfo);

              let age = 0
              if (userInfo.birthday != "") {
                age = new Date().getFullYear() - parseInt(userInfo.birthday / 10000)
              }
              this.setData({
                sport: userInfo.athletic_ability_v,
                vitality: userInfo.vitality_v,
                sex: userInfo.sex,
                age: age,
                birthday: userInfo.birthday,
                plan_describe: userInfo.plan_describe,
              });
            }
          }
        })
      }
    },
    // 刷新用户数据函数
    RefreshUserData: function () {
      if (app.globalData.userInfo != null) {
        if (app.globalData.netName == "evinf") {
          this.setData({
            obj: app.globalData.ev,
          });
        } else {
          this.setData({
            obj: app.globalData.sg,
          });
        }
        if (this.data.obj && this.data.obj.userId) {
          this.setData({
            hasUserInfo: true,
            avatarUrl: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
          });
        }
      }
      this.requestUserData();
    },
    weixinLoginTap: function () {
      // this.triggerEvent('weixinLoginTap');
      wx.navigateTo({
        url: '/pages/home/index'
      })
    },
    planTap: function () {
      console.log(this.data.plan_describe)
      if (this.data.plan_describe && this.data.plan_describe.plan_name != "") {
        wx.navigateTo({
          url: '/pages/user/plan'
        })
      }
      else {
        wx.showToast({
          title: '当前没有开启任何计划',
          icon: 'none'
        });
      }
    },

    jumpView: function (e) {
      let page = e.currentTarget.dataset['index'];
      if (this.data.obj && this.data.obj.userId) {
        wx.navigateTo({
          url: '/pages/user/' + page
        })
      }
      else {
        this.setData({ showLogin: true });
      }
    },

    editTap: function () {
      let s = this.data.sex == 1 ? 1 : this.data.sex == 2 ? 2 : 1;

      wx.navigateTo({
        url: '/pages/login/profile?first=0&sex=' + s + '&birthday=' + this.data.birthday
      })
    },
    showTips: function () {
      this.setData({ showLogin: true });
    },
    onClose () {
      this.setData({ showLogin: false });
      this.setData({ showExit: false });
    },

    showExit () {
      this.setData({ showExit: true });
    },
    // 授权登录
    authorizedLoginTap (event) {
      var that = this;
      // 判断当前状态为未授权状态
      // if (!authMark) 
      {
        // 授权中，目前状态只能点击一次
        authMark = true;
        // 呼出微信授权底部弹窗
        wx.getUserProfile({
          desc: '展示用户信息',
          success: resUserProfile => {
            app.setUserInfo(resUserProfile.userInfo);
            wx.login({
              success: resWxLogin => {
                console.log("resWxLogin:", resWxLogin);
                // 调用两个服务器的微信登录
                if (resWxLogin.code) {
                  let serverUrl = app.globalData.sg.svrUrl;
                  app.globalData.netName = "evinf" // TODO:测试
                  if (app.globalData.netName == "evinf") {
                    serverUrl = app.globalData.ev.svrUrl;
                  }
                  wx.request({
                    url: serverUrl + 'login/wechat',
                    method: "POST",
                    header: {
                      "content-type": "application/x-www-form-urlencoded"
                    },
                    data: {
                      code: resWxLogin.code,
                      name: resUserProfile.userInfo.nickName,
                      avatar: resUserProfile.userInfo.avatarUrl,
                    },
                    success: resLogin => {
                      if (resLogin.statusCode == 200 && resLogin.data.code == "200") {
                        var result = resLogin.data.data;
                        app.setUserAuth(result);
                        // 请求用户全部信息
                        wx.request({
                          url: serverUrl + 'get-user-all?user_ouid=' + result.user_ouid,
                          success: resUserAll => {
                            if (resUserAll.data.code == "200") {
                              let userAll = resUserAll.data.data.user;
                              that.setData({
                                plan_describe: userAll.plan_describe
                              })
                              app.setUserAll(userAll);
                              if (userAll.birthday == "") {
                                // 跳转到设置性别出生日期页面
                                wx.redirectTo({
                                  url: '/pages/login/profile?first=1&sex=' + userAll.sex
                                });
                              } else {
                                wx.redirectTo({
                                  url: '/pages/index/index'
                                });
                              }
                            }
                          }
                        })
                      }
                    },
                    fail: resLoginFail => {
                      console.log(resLoginFail);
                    }
                  });
                }
              },
              fail: function () {
                authMark = false;
              }
            })
          },
          fail: function () {
            // 授权失败，将标记置false
            authMark = false;
          }
        });
      }
    },
  },

  lifetimes: {
    ready () {
      this.RefreshUserData();
    }
  },
})