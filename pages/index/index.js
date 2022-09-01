// index.js
const app = getApp(); // 获取应用实例
import { request } from "../../utils/request.js";

Page({
	data: {
    scrollViewHeight: 0,
		obj: null,
		currPage: 'home',
    active:'',
    bgColor:'true',
    tabbarShow: 'true',
    navbarStyle: "background-image: linear-gradient(-45deg,#f5f5f5 50%, #e0fcfc, #dbeafd); background-size: 100% 830px;",
    showPhone: false,

    compID:'',
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
		wx.navigateTo({ url: '/pages/home/index' })
	},

	// 刷新主页数据
	RefreshUserData: function(){
		let userComponent = this.selectComponent('#user-component');
		userComponent.RefreshUserData();
	},
	
	onPageScroll: function (e) {
    let flag = e.scrollTop <= 0;
      this.setData({
        bgColor: flag
      })
  },

  OpenMember(param){
    // 检测是否用户登录
    this.data.compID = param.detail
    if(!app.globalData.user_ouid){
      this.authorizedLoginTap()
    } else {
      wx.navigateTo({ url: '/pages/member/openMember' })
    }
  },
  // 授权登录
  authorizedLoginTap (param) {
    if (param) this.data.compID = param.detail
    wx.getUserProfile({
      desc: '展示用户信息',
      success: resUserProfile => {
        wx.login({ success: resWxLogin => {
          this.wechatLogin(resWxLogin.code, resUserProfile.userInfo)
        }})
      },
    });
  },
  wechatLogin(code, userInfo){
    if (!code) return
    let data = {
      code: code,
      name: userInfo.nickName,
      avatar: userInfo.avatarUrl,
    }
    request({ url:"login/wechat", data:data, method:"POST"}).then((res) => {
      if (res.code == '200'){
        var result = res.data;
        app.setUserAuth(result);
        if (result.user_phone == ''){
          this.setData({showPhone: true})
        }
        this.getUserAll()
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
    }
    else{
      let requestData = {
        user_ouid: app.globalData.user_ouid,
        phone_code: e.detail.code
      }
      request({ url:"get-phone", data:requestData, method:"POST"}).then((res) => {
        if (res.code == '200'){
          let phone = res.data.phone
          app.setUserPhone(phone)
        }
      })
    }
  },

  getUserAll(){
    let user_ouid = app.globalData.user_ouid
    if (user_ouid) {
      request({ url:"get-user-all?user_ouid="+user_ouid, method:"GET"}).then((res) => {
        if (res.code == '200') 
          app.setUserAll(res.data.user);
          let comp = this.selectComponent("#"+this.data.compID);
          console.log('comp', comp)
          comp.RefreshUserData(); 
      })
    }
  }
})