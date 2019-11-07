const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 是否登录
// const checkLogin = function() {
//   wx.showToast({
//     title: '授权中---',
//     icon: 'loading'
//   })
//   console.log("---------- 点击登录  ------------")
//    this.register()
// }
const checkLogin = function() {
  wx.showToast({
    title: '授权中---',
    icon: 'loading'
  })
  console.log("---------- 点击登录  ------------")
  let that = this;
  let domain = app.globalData.domain;
  wx.login({
    success(r) {
      if (r.code) {
        wx.getUserInfo({
          lang: 'zh_CN',
          success(res) {
            console.log(res)
            wx.request({
              url: `${domain}/wchatUser/register`,
              method: 'POST',
              data: {
                code: r.code,
                iv: res.iv,
                encryptedData: res.encryptedData
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(data) {
                if (data.data.success) {
                  console.log('--------  登录成功-----------')
                   app.globalData.userInfo = data.data.result
                   app.globalData.userId =  data.data.result.id
                   wx.setStorage({
                    key: 'id',
                    data: data.data.result.id,
                  })
                  
                }
              }
            })
          }
        })
      }
    }
  })
}

const trueLogin = function(){
  if(app.globalData.userId == null){
    
  }
}

module.exports = {

  formatTime,
  formatNumber,
  checkLogin
}