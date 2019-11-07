const utils = require('../../utils/requst.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store:null,
    price:0,
    vipPrice:0,
    couponId:null,
    preferential:0,
    coupon:[],
    domain:app.globalData.domain + '/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let id = options.result
    
    let that = this;
    utils.sendRequest(`/shop/fandOneShop`, 'POST', {shopId:id,userId:app.globalData.userId})
    .then(res=>{
         that.setData({
           store: res.data.result
         })
    })
    this.getCouponNav()
  },
  onShow:function(){
    
  },
  getCouponNav:function(){
    let that = this;
    let data = {
      shopCondition: that.data.store,
      moneyCondition: 10000,
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
  getprice:function(e){
       this.setData({
         price: e.detail.value
       })
    let that = this;
    let data = {
      moneyCondition: e.detail.value,
      shopCondition: that.data.store.shop.id,
      userId: app.globalData.userId
    }
    utils.sendRequest(`/personCoupon/getPersonCp`, 'POST', data)
      .then(res => {
        console.log(res)
        if (res.data.success) {
          that.setData({
            coupon: res.data.result
          })
        }
      })
  },
  truepay:function(){
    let that = this;
    let { price, store, couponId} = that.data;
    
    console.log(1)
    let data = {
      totalSum: price,
      shopId: store.shop.id,
      couponId: couponId,
      userId: app.globalData.userId
    }
    utils.sendRequest(`/shopOrder/create`, 'POST', data)
      .then(res => {
        if (res.data.success) {
          let paymsg = res.data.result
          wx.requestPayment({
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
              that.onShow()
            },
            'fail': function (res) {

            },
            'complete': function (res) { }
          })
        
        }
      })
  },
  goConponpage:function(){
 
    let data = {
      id: this.data.store.shop.id,
      price: this.data.price
    }

    data = JSON.stringify(data)
    wx.navigateTo({
      url: `../couponUse/couponUse?data=${data}`,
    })
  },
})