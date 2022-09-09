// pages/login/profile.js
import Toast from '@vant/weapp/toast/toast';
import { request } from "../../utils/request.js";
import { formatBirthday } from "../../utils/util.js";
const app = getApp();

Page({
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

	onLoad: function (options) {
    let first = false;
    if (options.first)
      first = options.first
    let birthday = app.globalData.userAll.birthday
    if (birthday == 0){
      first = true
      birthday = new Date(2000, 0, 1).getTime();
    }
    else
      birthday =formatBirthday(birthday)
    let sex = app.globalData.userAll.sex
    this.setData({
      birthdayInit : birthday,
      sex : sex,
      first : first
    })
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
    let s = parseInt(this.data.sex);
    if (s != 2 && s != 1){
      Toast('请选择性别');
      return;
		}
    let bir = Number(this.dateFormat("YYYYmmdd",new Date(this.data.birthday)));
    let requestData = {
      user_ouid: app.globalData.userAuth.user_ouid,
      sex: s,
      birthday: bir
    }
    request({ url:"update-sex-birthday", data:requestData, method:"POST"}).then((res) => {
      if (res.code == "200") {
        wx.navigateBack();
      }
    })
  },

  refreshUserInfo(){
   
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