const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponNav: null,
    storeId: null
  },

  onLoad: function(options) {
    let that = this;
    utils.sendRequest(`/coupon/listByStart`, 'POST', {
        num: 10,
        status: 1
      })
      .then(res => {
        let arr = res.data.result.records.map(item => {
          item.flag = true
          return item
        })
        // console.log(arr)
        that.setData({
          couponNav: res.data.result.records
        })

      })
  },
  getCoupon: function(e) {
    let that = this;
    let arr = that.data.couponNav;
    let index = e.currentTarget.dataset.index;

    let data = {
      status: app.globalData.userId,
      id: arr[index].id
    }
    utils.sendRequest(`/coupon/getCoupon`, 'POST', data)
      .then(res => {
        if (!res.data.success) {
          wx.showToast({
            title: '已领取',
            icon: 'none',
          })
        }
        arr[index].flag = false;
        that.setData({
          couponNav: arr
        })
        console.log(that.data.couponNav)
      })
  },

})