// pages/user/sport.js
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
const app = getApp();

const col = ["颈部","肩部","胸部","背部","腹部","髋部","臀部","上臂","前臂","大腿","小腿"];

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		obj: null,
		bodyData: null,

    bgColor: true,
    sportValue: 0,    //运动力
    height: 0,        //身高
    weight: 0,        //体重
    bmi:0,            //bmi

    bodyComponent:[
      {name:"脂肪率", value:0, tag:"标准", icon:"/images/user/ico_body_02.png"},
      {name:"基础代谢量", value:0, tag:"标准", icon:"/images/user/ico_body_03.png"},
      {name:"身体年龄", value:0, tag:"标准", icon:"/images/user/ico_body_04.png"},
      {name:"水分", value:0, tag:"标准", icon:"/images/user/ico_body_05.png"},
    ],
  },
	// 显示用户数据
	showUserData: function () {
    let userAll = this.data.obj.userAll;
    if (!userAll.physique) return;
    let physique = JSON.parse(userAll.physique);
		//上次更新的日期
		let date = new Date(physique.gmt_update)
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
    var dates = date.getDate();

    var tagA = physique.fat > 36 ? '偏高' : physique.fat < 15 ? '偏低' :'标准';
    var tagB = physique.bmr > 1800 ? '偏高' : physique.fat < 1100 ? '偏低' :'标准';
    var tagC = physique.body_age > 0 ? '偏高' : physique.fat < 0 ? '偏低' :'标准';
    var tagD = physique.water > 57 ? '偏高' : physique.fat < 48 ? '偏低' :'标准';

    var body = [
      {name:"脂肪率", value:physique.fat, tag:tagA, icon:"/images/user/ico_body_02.png"},
      {name:"基础代谢量", value:physique.bmr, tag:tagB, icon:"/images/user/ico_body_03.png"},
      {name:"身体年龄", value:physique.body_age, tag:tagC, icon:"/images/user/ico_body_04.png"},
      {name:"水分", value:physique.water, tag:tagD, icon:"/images/user/ico_body_05.png"},
    ];

    let fitness = JSON.parse(userAll.fitness);
    let endurance = [];
    let power = [];
    endurance.push(fitness.neck.score);
    endurance.push(fitness.shoulder.score);
    endurance.push(fitness.chest.score);
    endurance.push(fitness.back.score);
    endurance.push(fitness.abdominal.score);
    endurance.push(fitness.coxa.score);
    endurance.push(fitness.hip.score);
    endurance.push(fitness.arm.score);
    endurance.push(fitness.forearm.score);
    endurance.push(fitness.leg.score);
    endurance.push(fitness.calf.score);

    power.push(fitness.neck_e.score);
    power.push(fitness.shoulder_e.score);
    power.push(fitness.chest_e.score);
    power.push(fitness.back_e.score);
    power.push(fitness.abdominal_e.score);
    power.push(fitness.coxa_e.score);
    power.push(fitness.hip_e.score);
    power.push(fitness.arm_e.score);
    power.push(fitness.forearm_e.score);
    power.push(fitness.leg_e.score);
    power.push(fitness.calf_e.score);

    this.setData({
      sportValue: userAll.athletic_ability_v,
      height: physique.height,
      weight: physique.weight,
      bmi: physique.bmi,
      updateDate: year + "/" + month + "/" + dates,
      bodyComponent:body,
    })

    lineChart.updateData({
      categories: col,
      animation: true,
      series: [{
          name: '耐力',
          data: endurance,
          color:"#94e6b0",
      }, {
          name: '力量',
          data: power,
          color:"#fba5a6",
        }]
    })
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		//直接获取到app.globalData的数据
		if (app.globalData.netName == "evinf") {
			this.setData({
				obj: app.globalData.ev,
			});
		} else {
			this.setData({
				obj: app.globalData.sg,
			});
		}
    var windowWidth = 320;
    try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth * 0.85;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }
    
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'column',
      categories: col,
      animation: true,
      // background: '#f5f5f5',
      series: [{
          name: '耐力',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          format: function (val, name) {
              return val.toFixed(0);
          },
          color:"#94e6b0",
      }, {
          name: '力量',
          data:  [10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          format: function (val, name) {
              return val.toFixed(0);
          },
          color:"#fba5a6",
      }],
      xAxis: {
          disableGrid: false,
          // gridColor: "#ffffff",
      },
      yAxis: {
          format: function (val) {
              return val.toFixed(0);
          },
          min: 0,
          disableGrid:false,
          // gridColor: "#ffffff",
      },
      width: windowWidth,
      height: 150,
      dataLabel: false,
      dataPointShape: true,
      extra: {
          lineStyle: 'straight',
          column:{
            width: 8
          }
      },
  });
  this.showUserData();
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
	toBodyTap(e) {
		wx.navigateTo({
			url: '/pages/user/body'
		})
  },
  returnHome(){
    wx.navigateBack({
      delta: 1
    });
  }
})