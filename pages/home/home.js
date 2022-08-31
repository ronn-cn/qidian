// pages/home/home.js
const app = getApp();
import { request } from "../../utils/request.js";
import {formatDate} from "../../utils/util.js"

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

Component({
  data: {
    nickname:'',
    avatar:'/images/home/avatar.svg',    
    store:{},
    tag:{},
    showInfo:['扫一扫', '训练计划', '体质检测', '意见反馈'],
    memberType:'',
    endTime:'',
    qrShow: false,
  },
  methods:{
    onLoad(options) {
      this.RefreshUserData()
    },
    RefreshUserData(){
      let userInfo = app.globalData.userInfo
      if (userInfo){
        this.setData({
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        })
      }
      request({ url:"get-store", method:"POST"}).then((res) => {
        if(res.code=='200'){
          this.setData({
            store: res.data,
            tag: JSON.parse(res.data.tag)
          }) 
        }
      })
      let data ={
        user_ouid:app.globalData.user_ouid,
        store_id:1
      }
      request({ url:"get-member", data:data,method:"POST"}).then((res) => {
        if(res.code=='200'){
          this.setData({
            memberType: res.data.member_type + "会员",
            endTime:formatDate(res.data.member_end_time)
          })
        }else{
          this.setData({
            memberType: '',
            endTime:''
          })
        }
      })
    },
    OpenMember: function (){
      // 检测是否用户登录
      if(!app.globalData.user_ouid){
        console.log("222")
        // 没有登录需要先授权
        wx.getUserProfile({
          desc: '展示用户信息',
          success: resUserProfile => {
            app.setUserInfo(resUserProfile.userInfo);
            wx.login({ success: resWxLogin => {              
              this.wechatLogin(resWxLogin.code)
              wx.navigateTo({ url: '/pages/member/openMember' })
            }})
          },
        });
      } else {
        wx.navigateTo({ url: '/pages/member/openMember' })
      }
    },
    switchstore(){
      // this.RefreshUserData()
    },
    menuClick(e){
      let index = e.currentTarget.dataset['index'];
      switch (index){
        case 0:
          this.scanCodeTapHandle();
          break;
        case 1:
          wx.navigateTo({ url: '/pages/sport/plan' })
          break;
        case 2:
          wx.showToast({
            title: '请前往体测仪',
            icon: 'error',
            duration: 1000,
          });
          break;
        case 3:
          wx.navigateTo({ url: '/pages/user/opinion' })
          break;
      }
    },

    // 点击扫码按钮的处理函数
	  scanCodeTapHandle: function () {
      let that = this
      if (app.globalData.userInfo != null) {
        // 判断用户信息存在，直接开启扫码
        wx.scanCode({
          onlyFromCamera: true,
          success: function (sc_res) {
            let url = sc_res.result; 
            var ouid = getQueryVariable(url, "ouid");
            // 登录到设备
            that.loginDevice(ouid);
          },
          fail: (res) => {//扫码失败后
            console.log("扫码失败",res)
         },
        });
      } else {
        this.setData({
          currPage: 'user'
        });
      }
    },

    wechatLogin(code){
      if (!code) return
      let data = {
        code: code,
        name: app.globalData.userInfo.nickName,
        avatar: app.globalData.userInfo.avatarUrl,
        phone: '17568914267',
      }
      request({ url:"login/wechat", data:data, method:"POST"}).then((res) => {
        if (res.code == '200'){
          var result = res.data;
          app.setUserAuth(result);
          this.RefreshUserData();
        }
      })
    },

    loginDevice(ouid) {      
      // 请求登录到设备
      console.log(ouid)
      let data = {
        "device_id": ouid,
        "user_ouid": app.globalData.user_ouid,
        "user_jwt": app.globalData.userJWT,
        "user_name": app.globalData.userInfo.nickName,
        "user_avatar": app.globalData.userInfo.avatarUrl,
        "store_id":1
      };
      request({ url:"login/device", data:data, method:"POST"}).then((res) => {
        console.log("登录结果", res)
        if (res.code == '200'){
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
        }
        else{
          wx.showToast({
            title: '登录失败',
            duration: 1000,
          })
        }
      })
    },

    showQR(){
      this.setData({qrShow: true})
    },

    onClickHide(){
      this.setData({qrShow: false})
    },

    showPhone(){
      wx.makePhoneCall({
        phoneNumber: this.data.store.phone,
        success: function () {        
          console.log("拨打电话成功")      
        },      
        fail: function () {        
          console.log("拨打电话失败")
        }    
      })
    }
  },
  lifetimes: {
    ready () {
      this.RefreshUserData();
    }
  },
})