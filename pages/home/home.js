// pages/home/home.js
const app = getApp();
import { request } from "../../utils/request.js";
import {formatDate, getDistance,getQueryVariable} from "../../utils/util.js"

Component({
  data: {
    showInfo:[
      {
        "image":"/images/home/scan_scan.svg",
        "name":"扫一扫"
      },
      {
        "image":"/images/home/training.svg",
        "name":"训练计划"
      },
      {
        "image":"/images/home/examination.svg",
        "name":"体质检测"
      },
      {
        "image":"/images/home/feedback.svg",
        "name":"意见反馈"
      }],
    nickname:'',
    avatar:'/images/home/avatar.svg',
    store:{},
    tag:{},
    memberStatus: false,
    memberType:'',
    endTime:'',
    qrShow: false,
  },
  methods:{
    RefreshUserData(){
      console.log('刷新Home页面数据')
      let userInfo = app.globalData.userAll
      if (userInfo){
        this.setData({
          nickname: userInfo.name,
          avatar: userInfo.avatar
        })
        if (userInfo.member_detail.status){
          this.setData({
            memberStatus: true,
            memberType: userInfo.member_detail.member_type + "会员",
            endTime:formatDate(userInfo.member_detail.member_end_time)
          })
        } else {
          this.setData({
            memberStatus: false,
            memberType: '',
            endTime:''
          })
        }
      }
      this.getStore()
    },

    // 获取门店
    getStore(){
      request({ url:"get-store", method:"POST"}).then((res) => {
        if (res.code == '200'){
          this.setData({
            store: res.data,
            tag: JSON.parse(res.data.tag)
          })
          this.getDis(res.data.latitude,res.data.longitude) 
        }
      })
    },
    getDis(x, y){
      let that = this
      wx.getFuzzyLocation({  
        type: 'wgs84',
        success (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          let a = getDistance(latitude,longitude,x,y)
          that.setData({distance:a})
        }
       })
    },
    // 开通会员
    openMember(){
      if(app.globalData.hasUser){
        wx.navigateTo({ url: '/pages/member/openMember'})
      } else {
        console.log("获取用户授权")
        this.triggerEvent("authorization", "home");
      }
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
      if (!app.globalData.userAuth){
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
        "user_ouid": app.globalData.userAuth.user_ouid,
        "user_jwt": app.globalData.userAuth.user_jwt,
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