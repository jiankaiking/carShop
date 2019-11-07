// pages/orderMsg/orderMsg.js
const app = getApp()
const utils = require("../../utils/util.js")
const util = require('../../utils/requst.js')
Page({

  data: {
     goods:null,
     domain:app.globalData.domain + '/'
  },
  onUnload:function(){
    clearInterval(this.data.timer);
  },
  onLoad:function(options){
    let that = this;
    console.log(options)
    let goodId = options.id;
    let userId = app.globalData.userId;
    util.sendRequest(`/salesOrder/findByOrder`, 'POST', { userId: userId, id: goodId})
    .then(res=>{
    
      if(res.data.success){
        that.setData({
          goods: res.data.result,
          orderId: options.id
        })
       
        if (res.data.result.salesOrder.status == 0){
          that.countDown()
        }
      }
    })
  },

 //确认收货
  truego:function(){
  
    let that = this;
    let id = that.data.orderId;
    util.sendRequest(`/salesOrder/confirmOreder`, 'POST', {
      id: id,
      userId: app.globalData.userId
    })
    .then(res=>{
      if(res.data.success){
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  //去评价
  esmitBtn: function () {
    let id = this.data.orderId;
    let goodId = this.data.goods.goodId;
    wx.navigateTo({
      url: `../estimate/estimate?id=${id}&goodId=${goodId}`,
    })
  },
  //点击去支付
  truePay: function () {
    let that = this;
    let id = that.data.orderId;
    let userId = app.globalData.userId;
    util.sendRequest(`/salesOrder/unifiedOrder`, 'POST', {
      id: id,
      userId: userId
    })
      .then(r => {
        console.log(r)
        if (r.data.success) {
          let paymsg = r.data.result
          wx.requestPayment(
            {
              'timeStamp': paymsg.timeStamp,
              'nonceStr': paymsg.nonceStr,
              'package': paymsg.packageStr,
              'signType': paymsg.signType,
              'paySign': paymsg.paySign,
              'success': function (res) {
                console.log(res)

                wx.showToast({
                  title: '支付成功',
                  icon: 'none'
                })
                wx.navigateBack({
                  delta:1
                })
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
              },
              'complete': function (res) { }
            })
        }

      })
  },

  //申请售后
  gosalem: function () {
    let id = this.data.orderId;
    wx.navigateTo({
      url: `../sale/sale?id=${id}`,
    })
  },
  getA: function () {
    var orders = this.data.goods;
  
    var status = orders.salesOrder.status;
      if (status == 0) {
        var create_time = orders.salesOrder.createTime;
        var leftTime = (new Date(create_time).getTime() + 15 * 60 * 1000) - (new Date().getTime());
        if (leftTime > 0) {
          var minutes = utils.formatNumber(parseInt(leftTime / 1000 / 60 % 60, 10));
          var seconds = utils.formatNumber(parseInt(leftTime / 1000 % 60, 10));
          var left_time = minutes + ":" + seconds;
          orders.salesOrder.left_time = left_time;
        } else {
        
        }
      }
    
    this.setData({
      goods: orders
    });
  
  },
  countDown: function () {
    var that = this;
    wx.hideLoading()
    that.getA()
    that.data.timer = setInterval(function () {
      that.getA()
    }, 1000);

  },

  onUnload: function () {
    clearInterval(this.data.timer);
  },
  //取消订单
  clearOrder:function(){
    let goodId = this.data.goods.salesOrder.id;
    let that = this;
    let userId = app.globalData.userId;
    util.sendRequest(`/salesOrder/cancellaOrder`, 'POST', { userId: userId, id: goodId })
    .then(res=>{
      if(res.data.success){
           wx.navigateBack({
             delta:1
           })
      }
    })
  }
})