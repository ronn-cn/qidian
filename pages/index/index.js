// index.js
const app = getApp(); // 获取应用实例
import { request } from "../../utils/request.js";
import { getQueryVariable } from "../../utils/util.js"

Page({
	data: {
    scrollViewHeight: 0,  // 滚动视图的高度
		currPage: 'home',     // 当前显示页面。home/user
    showPhone: false,
    isToOpenMember: false,  // 是否前往开通会员页面
  },
	onLoad: function (options) {
    this.calculatePageHeight();
		// 判断是扫码进入
		let url = decodeURIComponent(options.q);
    if (url != "undefined") { // url有定义，说明是微信扫码打开的小程序
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
		}
    // 判断刷新
    if(options.refresh){
      this.getUserAll()
    }
  },

  onTabChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ currPage: event.detail});
  },

  onShow() {
    this.getUserAll()
  },

  // 计算页面高度
  calculatePageHeight(){
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
      }).exec();
    }).exec();
  },

	// 刷新主页数据
	RefreshUserData: function(){
    let homeComponent = this.selectComponent('#home');
    if (homeComponent){
      homeComponent.RefreshUserData();
    }
    let userComponent = this.selectComponent('#user');
    if (userComponent){
      userComponent.RefreshUserData();
    }
	},

  openMember(e) {
    this.data.isToOpenMember = true
    // 检测是否用户登录
    if(!app.globalData.hasUser){
      this.getWechatAuthorization(e)
    } else {
      this.toOpenMember()
    }
  },
  // 获取微信授权并获取数据
  getWechatAuthorization(e) {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: resUserProfile => {
        wx.login({ success: resWxLogin => {
          let data = {
            code: resWxLogin.code,
            name: resUserProfile.userInfo.nickName,
            avatar: resUserProfile.userInfo.avatarUrl,
          }
          this.getUserAuth(data)
        }})
      },
    });
  },
  
  // 获取用户授权信息
  getUserAuth(data){
    request({ url:"login/wechat", method:"POST",data: data,}).then((res) => {
      if (res.code == '200') 
        app.setUserAuth(res.data);
        this.getUserAll()
        if(!app.globalData.userAuth.user_phone){
          this.setData({
            showPhone: true,
          })
        }
    })
  },
  // 获取用户全部数据
  getUserAll(){
    let user_ouid = app.globalData.userAuth?app.globalData.userAuth.user_ouid:'';
    if(!user_ouid) return
    request({ url:"get-user-all?user_ouid="+user_ouid, method:"GET"}).then((res) => {
      if (res.code == '200') {
        app.setUserAll(res.data.user);
        let comp = this.selectComponent("#"+this.data.currPage);
        if(comp){
          comp.RefreshUserData(); 
        }
        this.toOpenMember()
      }
    })
  },

  //获取电话号
  getPhoneNumber(e) {
    console.log(e.detail.code)
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: "授权失败",
        showCancel: false
      })
      return;
    } else {
      let requestData = {
        user_ouid: app.globalData.userAuth?app.globalData.userAuth.user_ouid:'',
        phone_code: e.detail.code
      }
      request({ url:"get-phone", data:requestData, method:"POST"}).then((res) => {
        if (res.code == '200'){
          let phone = res.data.phone
          app.globalData.userAuth.user_phone = phone;
        }
      })
    }
  },

  toOpenMember(){
    if (this.data.isToOpenMember){
      wx.navigateTo({ url: '/pages/member/openMember?store_id=1' })
      this.data.isToOpenMember = false
    }
  },
})