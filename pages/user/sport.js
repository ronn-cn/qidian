// pages/user/sport.js
import * as echarts from '../../ec-canvas/echarts';

function setOption1(chart, series_data) {
	let option = {
		xAxis: {
			type: 'category',
			data: ['腿部', '胸部', '背部', '腹部', '肩部', '臀部', '手臂']
		},
		yAxis: {
			type: 'value'
		},
		series: series_data
	};
	chart.setOption(option);
}

function initChart1(canvas, width, height, dpr, chartData) {
	const chart = echarts.init(canvas, null, {
		width: width,
		height: height,
		devicePixelRatio: dpr // new
	});
	canvas.setChart(chart);
	let option = {
		xAxis: {
			type: 'category',
			data: ['腿部', '胸部', '背部', '腹部', '肩部', '臀部', '手臂']
		},
		yAxis: {
			type: 'value'
		},
		series: chartData
	};
	chart.setOption(option);
	return chart;
}

function setOption2(chart, series_data) {
	let option = {
		radar: {
			indicator: [{
					name: '肌肉力量'
				},
				{
					name: '平衡协调'
				},
				{
					name: '发力控制'
				},
				{
					name: '柔韧灵活'
				},
				{
					name: '心肺耐力'
				}
			]
		},
		series: [{
			name: 'Budget vs spending',
			type: 'radar',
			symbol: "none", // 去掉图表中各个图区域的边框线拐点
			itemStyle: {
				normal: {
					lineStyle: {
						color: "white" // 图表中各个图区域的边框线颜色
					},
					areaStyle: {
						type: 'default'
					}
				}
			},
			data: series_data
		}]
	};

	chart.setOption(option);
}

function initChart2(canvas, width, height, dpr, chartData) {
	const chart = echarts.init(canvas, null, {
		width: width,
		height: height,
		devicePixelRatio: dpr // new
	});
	canvas.setChart(chart);
	let option = {
		radar: {
			indicator: [{
					name: '肌肉力量',
					max: 10
				},
				{
					name: '平衡协调',
					max: 10
				},
				{
					name: '发力控制',
					max: 10
				},
				{
					name: '柔韧灵活',
					max: 10
				},
				{
					name: '心肺耐力',
					max: 10
				}
			]
		},
		series: [{
			name: 'Budget vs spending',
			type: 'radar',
			symbol: "none", // 去掉图表中各个图区域的边框线拐点
			itemStyle: {
				normal: {
					lineStyle: {
						color: "white" // 图表中各个图区域的边框线颜色
					},
					areaStyle: {
						type: 'default'
					}
				}
			},
			data: chartData
		}]
	};

	chart.setOption(option);
	return chart;
}

const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		obj: "",
		ec1: {
			// onInit: initChart1
			lazyLoad: true
		},
		ec2: {
			// onInit: initChart2
			lazyLoad: true
		},
		userInfoAll: null,
		sportValue: 0,
		chartData1: null,
		chartData2: null,
		bodyData: null
	},
	requestUserData: function () {
		let that = this;
		let userId = that.data.obj.userId;
		if (userId) {
			wx.request({
				url: that.data.obj.svrUrl + 'get-user-all?user_id=' + userId,
				success: function (res) {
					console.log(res.data)
					if (res.data.code == "200") {
						let date = new Date(res.data.data.data.gmt_update)
						var year = date.getFullYear();
						var month = date.getMonth() + 1;
						var dates = date.getDate();

						
						var msArr = new Array();
						if (res.data.data.data.structure == ""){
							msArr = [0,0,0,0,0,0,0]
						} else {
							let ms = JSON.parse(res.data.data.data.structure);
							msArr[0] = ms.leg;
							msArr[1] = ms.chest;
							msArr[2] = ms.back;
							msArr[3] = ms.abdominal;
							msArr[4] = ms.shoulder;
							msArr[5] = ms.hip;
							msArr[6] = ms.forearm;
						}

						// 图表1数据
						let chartData1 = [{
							data: msArr,
							type: 'bar'
						}]
						console.log(chartData1)

						let ec1Component = that.selectComponent('#mychart-dom-bar');
						ec1Component.init((canvas, width, height, dpr) => {
							const chart = echarts.init(canvas, null, {
								width: width,
								height: height,
								devicePixelRatio: dpr // new
							});
							setOption1(chart, chartData1);
							return chart;
						});

						// 图表2数据
						var fiArr = new Array();
						if (res.data.data.data.fitness_index == ""){
							fiArr = [0,0,0,0,0]
						} else {
							let fi = JSON.parse(res.data.data.data.fitness_index);
							fiArr[0] = fi.power;
							fiArr[1] = fi.balance;
							fiArr[2] = fi.control;
							fiArr[3] = fi.flexibility;
							fiArr[4] = fi.endurance;
						}

						let chartData2 = [{
							value: fiArr,
						}]

						let ec2Component = that.selectComponent('#mychart-dom-graph');
						ec2Component.init((canvas, width, height, dpr) => {
							const chart = echarts.init(canvas, null, {
								width: width,
								height: height,
								devicePixelRatio: dpr // new
							});
							setOption2(chart, chartData2);
							return chart;
						});

						let bodyData = [{
							"name": "BMI",
							"value": res.data.data.data.bmi
						}, {
							"name": "脂肪率",
							"value": res.data.data.data.fat
						}, {
							"name": "基础代谢量",
							"value": res.data.data.data.bmr
						}, {
							"name": "身体年龄",
							"value": -1
						}, {
							"name": "水分率",
							"value": res.data.data.data.water
						}, {
							"name": "肌肉量",
							"value": res.data.data.data.muscle
						}, {
							"name": "骨骼量",
							"value": res.data.data.data.bone
						}, {
							"name": "脂肪等级",
							"value": res.data.data.data.vfi
						}, {
							"name": "蛋白质率",
							"value": res.data.data.data.protein
						}, {
							"name": "细胞外水份率",
							"value": res.data.data.data.ewf
						}]

						that.setData({
							userInfoAll: res.data.data,
							sportValue: res.data.data.data.sport_power,
							updateDate: year + "/" + month + "/" + dates,
							// chartData1: chartData1,
							// chartData2: chartData2,
							bodyData: bodyData,
						});

					}
				}
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (app.globalData.netName == "evinf") {
            this.data.obj = app.globalData.ev;
        } else {
            this.data.obj = app.globalData.sg;
        }
		this.requestUserData();
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

	}
})