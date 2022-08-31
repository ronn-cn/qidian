// index.js
const app = getApp(); // 获取应用实例
var authMark = true; // 避免重复授权的标记

Page({
	data: {
    scrollViewHeight: 0,
		obj: null,
		currPage: 'home',
    active:'',
    bgColor:'true',
    tabbarShow: 'true',
    navbarStyle: "background-image: linear-gradient(-45deg,#f5f5f5 50%, #e0fcfc, #dbeafd); background-size: 100% 830px;"
	},
	onLoad: function (options) {
    var screenHeight = wx.getSystemInfoSync().windowHeight
    let that = this
    // 获取navbar的高度
    let query = wx.createSelectorQuery();
    query.select('.nav-bar').boundingClientRect(navRect=>{
      let query2 = wx.createSelectorQuery();
      query2.select('.tab-bar').boundingClientRect(tabRect=>{
        that.setData({
          scrollViewHeight: screenHeight - navRect.height - tabRect.height,
        })
        console.log(that.data.scrollViewHeight)
      }).exec();
    }).exec();

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