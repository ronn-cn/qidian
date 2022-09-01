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
      let userInfo = app.globalData.userAll
      if (userInfo){
        this.setData({
          nickname: userInfo.name,
          avatar: userInfo.avatar
        })
        if (userInfo.member_detail){
          this.setData({
            memberType: userInfo.member_detail.member_type + "会员",
            endTime:formatDate(userInfo.member_detail.member_end_time)
          })
        }
        else{
          this.setData({
            memberType: '',
            endTime:''
          })
        }
      }
      request({ url:"get-store", method:"POST"}).then((res) => {
        if(res.code=='200'){
          this.setData({
            store: res.data,
            tag: JSON.parse(res.data.tag)
          }) 
        }
      })
      
    },
    OpenMember(){
      this.triggerEvent("OpenMember", 'home');
    },
    switchstore(){ },
    menuClick(e){
      if (!this.checkLogin()) return
      let index = e.currentTarget.dataset['index'];
      switch (index){
        case 0:
          this.scanCodeTapHandle();
          break;
        case 1:
          if (app.globalData.userAll.plan)
            wx.navigateTo({ url: '/pages/sport/plan' })
          else{
            wx.showToast({
              title: '暂无训练计划',
              icon: 'none'
            });
          }
          break;
        case 2:
          wx.showToast({
            title: '请前往体测仪',
            icon: 'none'
          });
          break;
        case 3:
          wx.navigateTo({ url: '/pages/user/opinion' })
          break;
      }
    },
    checkLogin(){
      if (!app.globalData.user_ouid){
        wx.showToast({
          title: '请先登录账号',
          icon: 'error',
        });
        return false
      }
      return true
    },
    // 点击扫码按钮的处理函数
	  scanCodeTapHandle: function () {
      let that = this
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
    },

    loginDevice(ouid) {      
      // 请求登录到设备
      console.log(ouid)
      let data = {
        "device_id": ouid,
        "user_ouid": app.globalData.user_ouid,
        "user_jwt": app.globalData.userJWT,
        "user_name": app.globalData.userAll.name,
        "user_avatar": app.globalData.userAll.avatar,
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