const app = getApp()
const utils = require('../../utils/requst.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 20,
    
    goodsItem: [],
    domain: app.globalData.domain,
    timer: null
  },
  onShow: function() {
    let status = this.data.navIndex;
    if(status == 11){
      this.getIndex1()
    }else{
      this.getSaleOrder(status)
    }
    
  },
  onLoad: function() {
   
    // this.getSaleOrder()
  },
  //获取订单列表
  getSaleOrder: function (status) {
     status = this.data.navIndex;
    clearInterval(this.data.timer)
    let userId = app.globalData.userId;
    let that = this;
    utils.sendRequest(`/salesOrder/findSalesOrder`, 'POST', {
        userId: userId,
        status: status
      })
      .then((res) => {
        if (res.data.success) {
          console.log(res)
          that.setData({
            goodsItem: res.data.result
          })
          if (that.data.navIndex == 0) {
            
            that.countDown()
          }
        }
      })
  },
  //点击订单状态
  getIndex: function(e) {
    //点击高度返回o
    wx.pageScrollTo({
      scrollTop: 0
    })
    clearInterval(this.data.timer);
    this.setData({
      navIndex: e.currentTarget.dataset.index
    })
    this.getSaleOrder(e.currentTarget.dataset.index)
  },
  //点击待发货
  getIndex1: function() {
    this.setData({
      navIndex: 11
    })
    let status = 1;

    let userId = app.globalData.userId;
    let that = this;
    utils.sendRequest(`/salesOrder/findSalesOrder`, 'POST', {
        userId: userId,
        status: status,
        type: 1
      })
      .then(res => {
        if (res.data.success) {
          that.setData({
            goodsItem: res.data.result
          })
        }
      })
  },
  trueOrder:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let id = that.data.goodsItem[index].salesOrder.id;
    let status = that.data.navIndex
    utils.sendRequest(`/salesOrder/confirmOreder`, 'POST', {
      id: id,
      userId: app.globalData.userId
    })
    .then(res=>{
      if(res.data.success){
        that.getSaleOrder(status)
      }
    })
  },

  //点击去支付
  truePay: function(e) {
    let index = e.currentTarget.dataset.index;
    let that = this;
    let id = that.data.goodsItem[index].salesOrder.id;
    let userId = app.globalData.userId;
    let goodId = that.data.goodsItem[index].salesOrder.goodId;
    utils.sendRequest(`/salesOrder/unifiedOrder`, 'POST', {
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
                setTimeout(function () {
                  that.getSaleOrder()
                }, 500)
              },
              'fail': function (res) {
    
              },
              'complete': function (res) { }
            })
        }
        
      })
  },
  // 未支付订单倒计时
  getA: function() {
   // console.log(1)
    var orders = this.data.goodsItem;
    for (var i = 0; i < orders.length; i++) {
      var status = orders[i].salesOrder.status;
      if (this.data.navIndex == 0 && orders.length >= 0) {
        var create_time = orders[i].salesOrder.createTime;
        var leftTime = (new Date(create_time).getTime() + 15 * 60 * 1000) - (new Date().getTime());
        if (leftTime > 0) {
          var minutes = util.formatNumber(parseInt(leftTime / 1000 / 60 % 60, 10));
          var seconds = util.formatNumber(parseInt(leftTime / 1000 % 60, 10));
          var left_time = minutes + ":" + seconds;
          orders[i].salesOrder.left_time = left_time;
          console.log(left_time)
        } else {
          //orders.splice(i, 1);
        }
      }else{
        clearInterval(this.data.timer);
      }
    }
    this.setData({
      goodsItem: orders
    });
    
  },
  //执行定时器
  countDown: function() {
    var that = this;
    wx.hideLoading()
    that.getA()
    that.data.timer = setInterval(function() {
      that.getA()
    }, 1000);
  },
  //清除定时器
  onUnload: function() {
    clearInterval(this.data.timer);
  },
  //订单详情
  goOrderMsg: function(e) {
    clearInterval(this.data.timer)
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../orderMsg/orderMsg?id=${id}`,
    })
  },
  esmitBtn: function(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.goodsItem[index].salesOrder.id;
    let goodId = this.data.goodsItem[index].salesOrder.goodId;
    wx.navigateTo({
      url: `../estimate/estimate?id=${id}&goodId=${goodId}`,
    })
  },
  //申请售后
  gosalem:function(e){
    let id = e.currentTarget.dataset.id;
  //  let status = this.data.navIndex
    wx.navigateTo({
      url: `../sale/sale?id=${id}`,
    })
  },
})