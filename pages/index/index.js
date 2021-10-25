// index.js
// 获取应用实例
const app = getApp();

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
		PageCur: 'home'
	},
	onLoad: function (options) {
		// 判断是扫码进入
		let url = decodeURIComponent(options.q);
		if (url.indexOf("device") >= 0) {
			let ouid = getQueryVariable(url, "ouid");
			// 判断授权
			if (app.globalData.hasUserInfo) {
				this.loginDevice(ouid);
			}
		}
	}, // 底部导航改变函数
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
		if (app.globalData.hasUserInfo) {
			// 判断用户信息存在，直接开启扫码
			wx.scanCode({
				onlyFromCamera: true,
				success: function (res) {
					var ouid = getQueryVariable(res.result, "ouid");
					// 登录到设备
					that.loginDevice(ouid);
				}
			});
		} else {
			// 用户信息不存在，先授权, 再扫码
			if (authMark) {
				authMark = false;
				wx.getUserProfile({
					desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: function (res) {
						app.globalData.userInfo = res.userInfo;
						app.globalData.hasUserInfo = true;
						wx.setStorageSync('user_info', res.userInfo);
						authMark = true;
						// 登录
						wx.login({
							success: function (res) {
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

												that.userComponent = that.selectComponent("#user-component");
												that.userComponent.RefreshUserData();
												// 调用微信扫码函数
												wx.scanCode({
													onlyFromCamera: true,
													success: function (res) {
														var ouid = getQueryVariable(res.result, "ouid");
														// 登录到设备
														that.loginDevice(ouid);
													}
												});
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
					},
					fail: function () {
						authMark = true;
					}
				})
			}

		}
	},
	loginDevice: function (ouid) {
		// 请求登录到设备
		wx.request({
			url: app.globalData.svrUrl + 'login/device',
			method: "POST",
			header: {
				"content-type": "application/json"
			},
			data: {
				"device_id": ouid,
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
		var that = this;
		if (authMark) {
			authMark = false;
			wx.getUserProfile({
				desc: '展示用户信息',
				success: function (res) {
					console.log(res)
					app.globalData.userInfo = res.userInfo;
					app.globalData.hasUserInfo = true;
					that.setData({
						userInfo: app.globalData.userInfo,
						hasUserInfo: app.globalData.hasUserInfo
					});
					authMark = true;

					wx.setStorageSync('user_info', res.userInfo);
					// 登录
					wx.login({
						success: function (res) {
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

											that.userComponent = that.selectComponent("#user-component");
											that.userComponent.RefreshUserData();
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
				},
				fail: function(){
					authMark = true;
				}
			})
		}
	}
})