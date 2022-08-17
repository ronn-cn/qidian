// pages/login/profile.js
import Toast from '@vant/weapp/toast/toast';

const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		bgColor: true,
		first: true,
    sex: 0,
    show:false, 
    checked:false,

    birthdayInit: '',
    birthday: '',
    minDate: new Date(1900, 0, 1).getTime(),
    maxDate: new Date().getTime(),
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    let first = true;
    let birthday = new Date(2000, 0, 1).getTime();
    let sex11 = 0;
		if (options.first == "0") {
			first = false;
    }
		if (options.birthday && options.birthday != "") {
      let year = options.birthday.slice(0, 4)
      let month = options.birthday.slice(4, 6)
      let day = options.birthday.slice(6, 8)
      birthday= new Date(year + "-" + (month) + "-" + day).getTime();
    }
    if (options.sex != ""){
      sex11 = options.sex;
    }
    this.setData({
      birthdayInit : birthday,
      sex : sex11 ? sex11: null,
      first : first
    })
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
	},
	/**
	 * 页面滚动
	 */
	onPageScroll: function (e) {
    let flag = e.scrollTop <= 0;
    this.setData({
      bgColor: flag
    })
	},
	// 性别选择
	bindSexSelect: function (e) {
		let query = e.currentTarget.dataset['index'];
		this.setData({
			sex: parseInt(query)
		})
	},
	// 提交信息
	submitTap: function () {
		let userId = "";
    let serverUrl = ""
		if (app.globalData.netName == "evinf") {
      userId = app.globalData.ev.userId;
			serverUrl = app.globalData.ev.svrUrl;
		} else {
			userId = app.globalData.sg.userId;
			serverUrl = app.globalData.sg.svrUrl;
    }
    
    if (this.data.first){
      if (!this.data.checked){
        Toast('请勾选同意《健身Link用户协议》和《隐私政策》');
        return;
      }
    }

    let s = parseInt(this.data.sex);
    if (s != 2 && s != 1){
      Toast('请选择性别');
      return;
		}

    let bir = Number(this.dateFormat("YYYYmmdd",new Date(this.data.birthday)));
		// 提交信息
		wx.request({
			url: serverUrl + 'update-sex-birthday',
			method: 'POST',
			data: {
				user_ouid: userId,
				sex: s,
				birthday: bir
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: resSexBirthday => {
				if (resSexBirthday.data.code == "200") {
					// 刷新主页数据
          // var pages = getCurrentPages();
          // console.log(pages)
					// var beforePage = pages[pages.length - 2];
          // 返回上一页
					wx.redirectTo({
            url: '/pages/index/index'
						// delta: 1,
						// success: function(){
						// 	beforePage.RefreshUserData();
						// }
					});
				}
			}
		})
  },
  
  showTipsTap: function (){
    this.setData({show : true});
  },
  onClose(event){
    this.setData({show : false});
  },
  noCheckAndClose(){
    this.setData({
      checked: false,
      show : false,
    });
  },
  checkAndClose(){
    this.setData({
      checked: true,
      show : false,
    });
  },

  onInput(event) {
    this.setData({
      birthday: event.detail,
    });
  },

  dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
})