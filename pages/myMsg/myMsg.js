// pages/myMsg/myMsg.js
const utils = require('../../utils/util.js')
const app = getApp()
const util = require('../../utils/requst.js')
Page({


  data: {
    userInfo: null,
    loginFalge:true,
    domain: app.globalData.domain,
    userFlag: false
  },
  //关闭
  loginClose: function (e) {

    this.setData({
      loginFalge: e.detail
    })
    this.getUeserInfor()
  },
  onLoad: function () {
  
  },
  goservice:function(){
    wx.navigateTo({
      url: '../service/service',
    })
  },
  onShow:function(){
    if (app.globalData.userId == null) {
      this.setData({
        loginFalge: false
      })
    } else {

      this.setData({
        loginFalge: true
      })
      this.data.userInfo == null ? this.getUeserInfor() : this.data.userInfo
    }
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.getUeserInfor()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  //获取用户信息
  getUeserInfor: function() {
    var that = this;
    let domain = app.globalData.domain
    wx.getStorage({
      key: 'id',
      success: function(res) {
        util.sendRequest(`/wchatUser/getUser`, 'POST', { id: res.data })
          .then(res => {
            let result = res.data.result
            if (res.data.success) {
              console.log(111111)
              app.globalData.userInfo = result
              app.globalData.userId = result.id
              that.setData({
                userInfo: app.globalData.userInfo
              })
              console.log(app.globalData.userInfo)
            }
          })
      },
      fail: function() {
        that.setData({
          userFlag: true
        })
      }
    })

  },
  //地址页面
  goAddress: function() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  //线下订单页面
  goRouterOrder: function() {
    wx.navigateTo({
      url: '../routerOrder/routerOrder',
    })
  },
  // 线上订单页面
  goOrder: function() {
    wx.navigateTo({
      url: '../myorder/myorder',
    })
  },
  //购物车
  goShoppingcar: function() {
    wx.navigateTo({
      url: '../shoppingcar/shoppingcar',
    })
  },
  //广告购买页面
  goadvertising: function() {
    wx.navigateTo({
      url: '../advertising/advertising',
    })
  },
  //广告管理
  goadvAdmin: function() {
    wx.navigateTo({
      url: '../advAdmin/advAdmin',
    })
  },
  //广告记录
  goadvAdvRecord: function() {
    wx.navigateTo({
      url: '../advRecord/advRecord',
    })
  },
  //优惠卷
  goCoupon: function() {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  //用户帮助
  goQuestion: function() {
    wx.navigateTo({
      url: '../question/question',
    })
  },
})