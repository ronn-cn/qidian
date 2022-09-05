// pages/user/sport.js
var wxCharts = require('../../utils/wxcharts.js');
import { request } from "../../utils/request.js";

var lineChart = null;
const app = getApp();

const col = ["颈部","肩部","胸部","背部","腹部","髋部","臀部","上臂","前臂","大腿","小腿"];

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    bgColor: true,
    userAll:{},
    sportValue: 0,    //运动力
    height: 0,        //身高
    weight: 0,        //体重
    bmi:0,            //bmi

    title: '体重',
    showDlg: false,
    Hcols:[],
    Wcols:[],
    WdefaultIndex:0,
    HdefaultIndex:0,
    selectValue:0,

    bodyComponent:[
      {name:"脂肪率", value:0, tag:"标准", icon:"/images/user/ico_body_02.png"},
      {name:"基础代谢量", value:0, tag:"标准", icon:"/images/user/ico_body_03.png"},
      {name:"身体年龄", value:0, tag:"标准", icon:"/images/user/ico_body_04.png"},
      {name:"水分", value:0, tag:"标准", icon:"/images/user/ico_body_05.png"},
    ],
  },
	// 显示用户数据
	showUserData: function () {
    request({ url:"get-user-all?user_ouid="+app.globalData.user_ouid, method:"GET"}).then((res) => {
      if (res.code == '200'){ 
        let userInfo = res.data.user;
        this.setSportData(userInfo)
        app.setUserAll(userInfo)
      }
    })
  },
  
  setSportData(userAll){
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

	onLoad: function (options) {
    var windowWidth = 320;
    try {
        var res = wx.getSystemInfoSync();
        windowWidth = res.windowWidth * 0.85;
    } catch (e) {
        console.error('getSystemInfoSync failed!');
    }

    let hcol = []
    for (let i = 40; i < 250; i++){
      hcol.push(i + 'cm')
    }
    let wcol = []
    for (let i = 20; i < 350; i++){
      wcol.push(i + 'kg')
    }
    this.setData({
      Hcols: hcol,
      Wcols: wcol,
    })
    
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
          max: 100,
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

	onPageScroll: function (e) {
		let flag = e.scrollTop <= 0;
    this.setData({
      bgColor: flag
    })
	},

  returnHome(){
    wx.navigateBack({ delta: 1 });
  },

  onChange(event) {
    const { value } = event.detail;
    this.setData({
      selectValue : value.replace('kg', '').replace('cm', '')
    })
    console.log(this.data.selectValue)
  },

  editInfo(e){
    let index = e.currentTarget.dataset['index'];
    let value = 0
    if (index == "身高") value = this.data.height
    if (index == "体重") value = this.data.weight
    this.setData({
      showDlg: true,
      title: index,
      WdefaultIndex : this.data.weight - 20,
      HdefaultIndex : this.data.height - 40,
      selectValue: value
    })
  },

  modifyInfo(){
    if (this.data.title == '身高'){
      this.setData({height: Number(this.data.selectValue)})
    }
    else if (this.data.title == '体重'){
      this.setData({weight: Number(this.data.selectValue)})
    }
    let requstData = {
      user_ouid : app.globalData.user_ouid,
      height : this.data.height,
      weight : this.data.weight
    }
    request({ url:"update-height-weight", data:requstData, method:"POST"})
  }
})