const app = getApp()


//支付
const payMoney = function(){

}
//post请求
var sendRequest = function (url, method, data = {}) {
  wx.showLoading({
    title: '加载中',
  })
  let domain = app.globalData.domain;
  var promise = new Promise(function (resolve, reject) {
    
    wx.request({
      url: domain + url,
      data: data,
      method: method,
      header: {
        'content-type': 'application/json'
      },
      success: function (data) {
        wx.hideLoading()
        resolve(data);
      },
      fail: function (data) {
        reject(data);
      }
    })
  })

  return promise
}


//导入
module.exports = {
  sendRequest: sendRequest
}

