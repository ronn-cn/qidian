// app.js
App({
	onLaunch() {
    // 当小程序启动的时候，先判断是否存储sg
		let sg = wx.getStorageSync('sg');
		if (sg) {
			// console.log("sg:", sg);
			this.globalData.sg = JSON.parse(sg);
    }
    // 判断是否存储ev
		let ev = wx.getStorageSync('ev');
		if (ev) {
			// console.log("ev:", ev);
			this.globalData.ev = JSON.parse(ev);
    }
    // 判断是否存储用户授权信息
		let userInfo = wx.getStorageSync('user_info');
		if (userInfo) {
			// console.log("userInfo:", userInfo);
			this.globalData.userInfo = JSON.parse(userInfo);
    }
    
    let netName = wx.getStorageSync('net_name');
		if (netName) {
			this.globalData.netName = netName;
		}

		wx.getSystemInfo({
			success: e => {
				this.globalData.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				this.globalData.Custom = custom;
				this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
			}
		})
  },
  // 全局数据,默认sportguider
	globalData: {
		netName: "sportguider", // 网络名称
		userInfo: null, // 用户信息
		sg: {
			userId: "",
			userJWT: "",
			userAll: null,
			svrUrl: "https://sport.sportguider.com/",
		},
		ev: {
			userId: "",
			userJWT: "",
			userAll: null,
			svrUrl: "https://sport.evinf.cn/",
		}
	},
	// 设置用户信息函数
	setUserInfo(user) {
		this.globalData.userInfo = user;
		wx.setStorageSync('user_info', JSON.stringify(user));
	},
	// 设置用户权限信息
	setUserAuth(user) {
		if(this.globalData.netName == "evinf"){
			this.globalData.ev.userId = user.user_id;
			this.globalData.ev.userJWT = user.user_jwt;
			wx.setStorageSync('ev', JSON.stringify(this.globalData.ev));
		} else {
			this.globalData.sg.userId = user.user_id;
			this.globalData.sg.userJWT = user.user_jwt;
			wx.setStorageSync('sg', JSON.stringify(this.globalData.sg));
		}
	},
	// 设置用户全部信息
  setUserAll(userall){
		if(this.globalData.netName == "evinf"){
			this.globalData.ev.userAll = userall;
			wx.setStorageSync('ev', JSON.stringify(this.globalData.ev));
		} else {
			this.globalData.sg.userAll = userall;
			wx.setStorageSync('sg', JSON.stringify(this.globalData.sg));
		}
  },
  setNetName(name){
    if(name == "evinf"){
      this.globalData.netName = "evinf";
    } else {
      this.globalData.netName = "sportguider";
    }
  }
})