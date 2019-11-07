const app = getApp()
const utils = require('../../../utils/requst.js')
const util = require('../../../utils/util.js')
Component({

  behaviors: [],

  properties: {

  },
  data: {
   
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
   
  },
  moved: function () { },
  detached: function () { },

  methods: {
    closeLogin:function(){
      this.triggerEvent('myevent', true)
    },
    getUserInformation: function (e) {
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
                  success: function (data) {
                    if (data.data.success) {
                      console.log('--------  登录成功-----------')
                      app.globalData.userInfo = data.data.result
                      app.globalData.userId = data.data.result.id
                      wx.setStorage({
                        key: 'id',
                        data: data.data.result.id,
                      })
                      that.triggerEvent('myevent', true)
                    }
                  }
                })
              }
            })
          }
        }
      })
    },
  }

})
