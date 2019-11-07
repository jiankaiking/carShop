const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponNav: null,
  },

  onLoad: function (options) {
    console.log(options)
    let that = this;
    let optionsArr = JSON.parse(options.data)
    let data = {
      shopCondition: optionsArr.id,
      moneyCondition: optionsArr.price,
      userId: app.globalData.userId
    }
    utils.sendRequest(`/personCoupon/getPersonCp`, 'POST', data)
      .then(res => {
        console.log(res)
        that.setData({
          couponNav: res.data.result
        })

      })
  },
  optionsCoupon:function(e){
    let index = e.currentTarget.dataset.index;
    let id = this.data.couponNav[index].id;
    let pages = getCurrentPages()
    let preve = pages[pages.length - 2]
    preve.setData({
      couponId:id,
      preferential: this.data.couponNav[index].money
    })
    wx.navigateBack({
      detal:1
    })
  }
})