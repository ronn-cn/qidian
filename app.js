// app.js
App({
  onLaunch() {
    let sg = wx.getStorageSync('sg');
    let ev = wx.getStorageSync('ev');
    if (sg){
      console.log("sg:", sg);
      this.globalData.sg = JSON.parse(sg);
    } 

    if (ev){
      console.log("ev:", ev);
      this.globalData.ev = JSON.parse(ev);
    }

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    netName: "sportguider",
    sg: {
      userInfo: null,
      hasUserInfo: false,
      userId:"",
      userName:"",
      userAvatar:"",
      userJWT:"",
      svrUrl: "https://sport.sportguider.com/",
    },
    ev:{
      userInfo: null,
      hasUserInfo: false,
      userId:"",
      userName:"",
      userAvatar:"",
      userJWT:"",
      svrUrl: "https://sport.evinf.cn/",
    },
  }
})