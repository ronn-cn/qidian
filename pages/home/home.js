// pages/home/home.js
const app = getApp();
import { request } from "../../utils/request.js";

Component({
  data: {
    nickname:'',
    avatar:'/images/home/avatar.svg',    
    store:{},
    tag:{},
    showInfo:['扫一扫', '训练计划', '体质检测', '意见反馈'],
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
    },
    OpenMember: function (){
      wx.navigateTo({ url: '/pages/member/openMember' })
    },
    switchstore(){
      // this.RefreshUserData()
    },
    menuClick(){
      this.scanCodeTapHandle();
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
            var ouid = getQueryVariable(url, "ouid");
            // 登录到设备
            that.loginDevice(ouid);
          }
        });
      } else {
        this.setData({
          currPage: 'user'
        });
      }
    },
  },
  lifetimes: {
    ready () {
      this.RefreshUserData();
    }
  },
})