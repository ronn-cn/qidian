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
    svrUrl:  "https://sport1.evinf.cn/",
    userAll: null,  // 用户信息
    user_ouid: "",
    userJWT: "",
    user_phone:"",
    orderList: [],  // 订单列表
	},

	// 设置用户权限信息
	setUserAuth(user) {
    console.log("用户信息", user)

    this.globalData.user_ouid = user.user_ouid;
    this.globalData.userJWT = user.user_jwt;
    this.globalData.user_phone = user.user_phone;
		wx.setStorageSync('user_ouid', user.user_ouid);
		wx.setStorageSync('user_jwt', user.user_jwt);
		wx.setStorageSync('user_phone', user.user_phone);
  },
  
  setUserPhone(phone){
    this.globalData.user_phone = phone;
		wx.setStorageSync('user_phone', phone);
  },
	// 设置用户全部信息
  setUserAll(userall){
    this.globalData.userAll = userall;
    wx.setStorageSync('user_all', JSON.stringify(userall));
  },

  setLogout(){
    wx.removeStorageSync('user_ouid');
    wx.removeStorageSync('user_all');
    wx.removeStorageSync('user_jwt')
    this.globalData.user_ouid = null
    this.globalData.userAll = null
    this.globalData.userJWT = null
  },
})