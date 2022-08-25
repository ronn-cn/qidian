const app = getApp();
const url = app.globalData.svrUrl; 

export const request = (parmas) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url + parmas.url,   
      method: parmas.method,
      data: JSON.stringify(parmas.data),
      header: parmas.method === 'POST' ?
      {'content-type': 'application/x-www-form-urlencoded'} : {'content-type': 'application/json'},
      success: (res)=> {
          resolve(res.data)
      },
      fail: (err) => {
          reject(err)
      },
    })
  })
}
