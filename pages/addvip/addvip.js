const utils = require('../../utils/requst.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: null,
    domain: app.globalData.domain + '/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let shopId = options.result
    
    let that = this;
    utils.sendRequest(`/shop/fandOneShop`, 'POST', {
      shopId: shopId,
        userId:app.globalData.userId
      })
      .then(res => {
        console.log(res)
        that.setData({
          store: res.data.result
        })
      })
     
  },
  trueAddVip: function() {
    let data = {
      userId: app.globalData.userId,
      shopId: this.data.store.shop.id
    }
    utils.sendRequest(`/shopOrder/relation`, 'POST', data)
      .then(res => {
         if(res.data.success){
           wx.showToast({
             title: '添加成功',
             success:function(){
               wx.navigateBack({
                 detal: 1
               })
             }
           })
         }
      })
  },
  clearBtn: function() {
    wx.navigateBack({
      detal: 1
    })
  },
})