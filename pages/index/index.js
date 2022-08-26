// index.js
const app = getApp(); // 获取应用实例
var authMark = true; // 避免重复授权的标记

// 私有自定义函数
function getQueryVariable(query, variable) {
	var params = query.split("?");
	if (params.length > 1) {
		var vars = params[1].split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1];
			}
		}
	}
	return (false);
}

Page({
	data: {
    scrollViewHeight: 0,
		obj: null,
		currPage: 'home',
    active:'',
    bgColor:'true',
    tabbarShow: 'true'
	},
	onLoad: function (options) {
    let query = wx.createSelectorQuery();
    var screenHeight = wx.getSystemInfoSync().windowHeight
    let that = this
    // 获取navbar的高度
    query.select('.nav-bar').boundingClientRect();
    query.exec(function (navRect) {
      query.select('.tab-bar').boundingClientRect();
      query.exec(function (tabRect) {
        that.setData({
          scrollViewHeight: screenHeight - navRect.height - tabRect.height,
        })
      })
    });

		// 判断是扫码进入
		let url = decodeURIComponent(options.q);
    if (url != "undefined") { // url有定义，说明是微信扫码打开的小程序
      if (url.includes("evinf")) { // 判断二维码的信息来自evinf
        if(app.globalData.netName != "evinf"){
          app.globalData.userInfo = null
        }
				this.data.obj = app.globalData.ev;
      } else {  //只要不是包含evinf都属于sportguider
        if(app.globalData.netName != "sportguider"){
          app.globalData.userInfo = null
        }
				this.data.obj = app.globalData.sg ;
			}
			if (url.includes("device")) {
				let ouid = getQueryVariable(url, "ouid");
				// 判断授权
				if (app.globalData.userInfo != null) {
					this.loginDevice(ouid);
				} else {
					wx.navigateTo({
						url: '/pages/login/index',
					});
				}
			}
		} else {
			if (app.globalData.netName == "evinf") {
				this.data.obj = app.globalData.ev;
			} else {
				this.data.obj = app.globalData.sg;
			}
		}
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ currPage: event.detail});
  },
 
	
	loginDevice: function (ouid) {
		console.log("loginDevice");
		let that = this;
		// 请求登录到设备
		// console.log(app.globalData.userInfo);
		wx.request({
			url: that.data.obj.svrUrl + 'login/device',
			method: "POST",
			header: {
				"content-type": "application/json"
			},
			data: {
				"device_id": ouid,
				"user_ouid": that.data.obj.userId,
				"user_jwt": that.data.obj.userJWT,
				"user_name": app.globalData.userInfo.nickName,
				"user_avatar": app.globalData.userInfo.avatarUrl
			},
			success: res2 => {
				console.log("loginDevice:", res2);
				if (res2.statusCode == 200 && res2.data.code == "200") {
					wx.showToast({
						title: '登录成功',
						duration: 1000,
					});
					setTimeout(function () {
						wx.showToast({
							title: '器械无操作10分钟后自动退出',
							icon: 'none',
							duration: 3000,
						});
					}, 1000)
				} else {
					// 不正确
					wx.showToast({
						title: "未成功登录",
						duration: 1000,
					})
				}
			},
			fail: res2 => {
				wx.showToast({
					title: '登录失败',
					duration: 1000,
				})
			}
		})
	},
	weixinLoginTapHandle: function () {
		wx.navigateTo({
			url: '/pages/home/index'
		})
	},

	// 刷新主页数据
	RefreshUserData: function(){
		let userComponent = this.selectComponent('#user-component');
		userComponent.RefreshUserData();
	},

	/**
	 * 页面滚动
	 */
	onPageScroll: function (e) {
    let flag = e.scrollTop <= 0;
      this.setData({
        bgColor: flag
      })
	}
})