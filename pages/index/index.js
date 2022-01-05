// index.js
// 获取应用实例
const app = getApp();

// 避免重复授权的标记
var authMark = true;

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
		obj: null,
		PageCur: 'home',
		bgColor: ''
	},
	onLoad: function (options) {
		// 判断是扫码进入
		let url = decodeURIComponent(options.q);
		if (url != "undefined") {
			if (url.indexOf("evinf") >= 0) {
				app.globalData.netName = "evinf";
				this.data.obj = app.globalData.ev;
			} else {
				app.globalData.netName = "sportguider";
				this.data.obj = app.globalData.sg;
			}
			if (url.indexOf("device") >= 0) {
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

		//如果没有授权的话跳转到登录页面
		// if(app.globalData.userInfo == null){
		// 	wx.reLaunch({
		// 	  url: '/pages/login/index',
		// 	});
		// }
	},
	// 底部导航改变函数
	NavChange(e) {
		this.setData({
			PageCur: e.currentTarget.dataset.cur
		});
		if (wx.pageScrollTo) {
			wx.pageScrollTo({
				scrollTop: 0
			})
		}
	},
	// 点击扫码按钮的处理函数
	scanCodeTapHandle: function () {
		let that = this;
		if (app.globalData.userInfo != null) {
			// 判断用户信息存在，直接开启扫码
			wx.scanCode({
				onlyFromCamera: true,
				success: function (sc_res) {
					let url = sc_res.result;
					//string.includes(word);
					if (url.indexOf("evinf") >= 0) {
						app.globalData.netName = "evinf";
						that.data.obj = app.globalData.ev;
					} else {
						app.globalData.netName = "sportguider";
						that.data.obj = app.globalData.sg;
					}
					var ouid = getQueryVariable(url, "ouid");
					// 登录到设备
					console.log(that.data.obj);
					that.loginDevice(ouid);
				}
			});
		} else {
			wx.navigateTo({
				url: '/pages/login/index',
			});
			// 用户信息不存在，先授权, 再扫码
			// if (authMark) {
			// 	authMark = false;
			// 	wx.getUserProfile({
			// 		desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			// 		success: function (res) {
			// 			app.globalData.userInfo = res.userInfo;
			// 			that.setData({
			// 				userInfo: app.globalData.userInfo
			// 			});
			// 			authMark = true;
			// 			// 登录
			// 			wx.login({
			// 				success: function (res) {
			// 					// 发送 res.code 到后台换取 openId, sessionKey, unionId
			// 					if (res.code) {
			// 						wx.request({
			// 							url: that.data.obj.svrUrl + 'login/wechat',
			// 							method: "POST",
			// 							header: {
			// 								"content-type": "application/x-www-form-urlencoded"
			// 							},
			// 							data: {
			// 								code: res.code,
			// 							},
			// 							success: res2 => {
			// 								console.log(res2);
			// 								if (res2.statusCode == 200 && res2.data.code == "200") {
			// 									var result = res2.data.data;
			// 									// 返回值正确
			// 									that.data.obj.userId = result.user_id;
			// 									that.data.obj.userJWT = result.user_jwt;

			// 									// 存储为本地数据
			// 									if (app.globalData.netName == "evinf") {
			// 										app.globalData.ev = that.data.obj;
			// 										wx.setStorageSync('ev', JSON.stringify(that.data.obj));
			// 									} else {
			// 										app.globalData.sg = that.data.obj;
			// 										wx.setStorageSync('sg', JSON.stringify(that.data.obj));
			// 									}

			// 									console.log("aaa:", that.data.obj);
			// 									that.userComponent = that.selectComponent("#user-component");
			// 									that.userComponent.RefreshUserData();
			// 									// 调用微信扫码函数
			// 									wx.scanCode({
			// 										onlyFromCamera: true,
			// 										success: function (sc_res) {
			// 											let url = sc_res.result;
			// 											if (url.indexOf("evinf") >= 0) {
			// 												app.globalData.netName = "evinf";
			// 												that.data.obj = app.globalData.ev;
			// 											} else {
			// 												app.globalData.netName = "sportguider";
			// 												that.data.obj = app.globalData.sg;
			// 											}
			// 											var ouid = getQueryVariable(url, "ouid");
			// 											// 登录到设备
			// 											that.loginDevice(ouid);
			// 										}
			// 									});
			// 								} else {
			// 									// 返回值不正确
			// 									wx.showToast({
			// 										title: 'OpenId未获取',
			// 										duration: 1000,
			// 									})
			// 								}
			// 							},
			// 							fail: res2 => {
			// 								console.log(res2);
			// 								wx.showToast({
			// 									title: 'OpenId获取失败',
			// 									duration: 1000,
			// 								})
			// 							}
			// 						});
			// 					} else {
			// 						wx.showToast({
			// 							title: '未获取到代码',
			// 							duration: 1000,
			// 						})
			// 					}
			// 				},
			// 				fail: res => {
			// 					// 失败返回
			// 					console.log(res);
			// 					wx.showToast({
			// 						title: '微信登录失败',
			// 						duration: 1000,
			// 					})
			// 				}
			// 			})
			// 		},
			// 		fail: function () {
			// 			authMark = true;
			// 		}
			// 	})
			// }

		}
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
				"user_id": that.data.obj.userId,
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
			url: '/pages/login/index'
		})
	},
	planTapHandle: function (e) {
		if (app.globalData.userInfo != null) {
			console.log("plan:", e);
			if (e.detail != "") {
				wx.navigateTo({
					url: '/pages/user/plan'
				})
			} else {
				wx.showToast({
					title: '当前没有开启任何计划',
					icon: 'none'
				});
			}
		}
	},
	vitalityTapHandle: function () {
		if (app.globalData.userInfo != null) {
			wx.navigateTo({
				url: '/pages/user/vitality'
			})
		}
	},
	sportTapHandle: function () {
		if (app.globalData.userInfo != null) {
			wx.navigateTo({
				url: '/pages/user/sport'
			})
		}
	},
	editTapHandle: function (e) {
		console.log(e.detail);
		wx.navigateTo({
			url: '/pages/login/profile?first=0&sex=' + e.detail.sex + '&birthday=' + e.detail.birthday
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
		console.log(e.scrollTop)
		if (e.scrollTop <= 0) {
			if (this.data.bgColor != '') {
				this.setData({
					bgColor: ''
				})
			}
		} else {
			if (this.data.bgColor == '') {
				this.setData({
					bgColor: '#fff'
				})
			}
		}
	}
})