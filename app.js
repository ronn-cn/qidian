// app.js
App({
  onLaunch() {
    if (!this.globalData.userInfo) {
      let userInfo = wx.getStorageSync('user_info');
      console.log("userInfo:",userInfo);
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.hasUserInfo = true;
      }
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
    userInfo: null,
    hasUserInfo: false,
    svrUrl: "https://sport.sportguider.com/"
  }
})