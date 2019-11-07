// pages/paysuccess/paysuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      id: options.id
    })
  },
  goOrdermsg: function() {
    wx.navigateTo({
      url: `../orderMsg/orderMsg?id=${this.data.id}`,
    })
  },
  goIndex: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
})