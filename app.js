// 小程序文档
// http://172.16.8.5:8806/swagger/index.html

// app.js
App({
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
		let user_info = wx.getStorageSync('user_info');
    if (user_info)  this.globalData.userInfo = JSON.parse(user_info);
    
    let user_ouid = wx.getStorageSync('user_ouid');
    if (user_ouid) 	this.globalData.user_ouid = user_ouid;

    let userAll = wx.getStorageSync('user_all');
    if (userAll) 	this.globalData.userAll = JSON.parse(userAll);

    let userJWT = wx.getStorageSync('user_jwt');
    if (userAll) 	this.globalData.userJWT =userJWT;

		wx.getSystemInfo({
			success: e => {
				this.globalData.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				this.globalData.Custom = custom;
				this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
			}
		})
  },
  // 全局数据
	globalData: {
    userInfo: null, // 用户微信信息
    svrUrl:  "https://sport1.evinf.cn/",
    user_ouid: "",
    userJWT: "",
    userAll: null,
	},
	// 设置用户信息函数
	setUserInfo(user) {
    this.globalData.userInfo = user;
		wx.setStorageSync('user_info', JSON.stringify(user));
	},
	// 设置用户权限信息
	setUserAuth(user) {
    console.log("用户信息", user)
    this.globalData.user_ouid = user.user_ouid;
    this.globalData.userJWT = user.user_jwt;
		wx.setStorageSync('user_ouid', user.user_ouid);
		wx.setStorageSync('user_jwt', user.user_jwt);
	},
	// 设置用户全部信息
  setUserAll(userall){
    this.globalData.userAll = userall;
    wx.setStorageSync('user_all', JSON.stringify(userall));
  },

  setLogout(){
    wx.removeStorageSync('user_info');
    wx.removeStorageSync('user_ouid');
    wx.removeStorageSync('user_all');
    this.globalData.userInfo = null
    this.globalData.user_ouid = null
    this.globalData.userAll = null
  }
})