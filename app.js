// 小程序文档
// http://172.16.8.5:8806/swagger/index.html

App({
  // 全局数据
	globalData: {
    svrUrl:  "https://sport1.evinf.cn/",
    hasUser: false, // 有无用户
    userAll: null,  // 用户全部信息
    userAuth: null, // 用户授权信息
    orderList: [],  // 订单列表
  },
  // 首次启动
	onLaunch() {
    // 当小程序启动的时候，先判断是否存储sg
    const version = __wxConfig.envVersion;
    switch (version) {
      // 开发 测试
      case 'develop':
      case 'trial':
      default:
        this.globalData.svrUrl= 'https://sport1.evinf.cn/'
        break;
      // 线上
      case 'release':
        this.globalData.svrUrl= 'https://sport.sportguider.com/'
        break;
    }

    let userAuth = wx.getStorageSync('user_auth');
    if (userAuth){
      this.setUserAuth(JSON.parse(userAuth))
    }
    let userAll = wx.getStorageSync('user_all');
    if (userAll){
      this.setUserAll(JSON.parse(userAll))
    }
  },
	// 设置用户权限信息
	setUserAuth(userauth) {
    console.log("用户授权信息", userauth)
    if(userauth&&userauth.user_ouid) {
      this.globalData.userAuth = userauth
      wx.setStorageSync('user_auth', JSON.stringify(userauth));
    } else {
      this.setUserLogout();
    }
  },

	// 设置用户全部信息
  setUserAll(userall){
    console.log("用户所有数据：",userall);
    if(userall&&userall.ouid){
      this.globalData.hasUser = true;
      this.globalData.userAll = userall;
      wx.setStorageSync('user_all', JSON.stringify(userall));
    } else {
      this.setUserLogout();
    }
  },

  // 设置用户退出
  setUserLogout(){
    wx.removeStorageSync('user_all');
    wx.removeStorageSync('user_auth');
    this.globalData.hasUser = false;
    this.globalData.userAll = null;
    this.globalData.userAuth = null;
  },

  //获取用户全部数据
  getUserAll(){
    let that = this;
    let user_ouid = this.globalData.userAuth.user_ouid?this.globalData.userAuth.user_ouid:'';
    if (!user_ouid) return
    return new Promise(function(resolve,reject){
      wx.request({
        url: that.globalData.svrUrl + 'get-user-all?user_ouid='+user_ouid,
        method:"GET",
        success: function(res) {
          let resUserAll = res.data
          console.log(resUserAll)
          if (resUserAll.code == '200') {
            that.setUserAll(resUserAll.data.user);
          }
          resolve(resUserAll)
        },
        fail: function(err){
          reject(err)
        }
      })
    })
  },
})