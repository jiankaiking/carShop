// pages/getGoods/getGoods.js
const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  data: {
    type: 1,
    domain:app.globalData.domain,
    addressCont: null,
    storeMsg:null,
    goods: null,
    stringItemAll:null,
    stringItem: null,
    num: null
  },
  onLoad: function(options) {
    let stringItemAll = JSON.parse(options.stringItem)
    let stringItem = stringItemAll.salerList[0]
    console.log(stringItem)
    this.setData({
      stringItemAll: stringItemAll,
      stringItem: stringItem,
      price: (stringItem.freight + stringItem.serviceCharge).toFixed(2)
    })
    if (stringItem.type == 2){
      let that = this;
      utils.sendRequest(`/shop/queryById`, 'GET', {
        id: stringItem.shopId, 
      })
      .then(res=>{
        that.setData({
          storeMsg:res.data.result
        })
      })
    }
  },

  //点击下单
  saveOrder: function() {
    let userId = app.globalData.userId;
    let that = this;
    let addresscont = that.data.addressCont;
    let data = that.data.stringItemAll;
    let orderId  = []
    utils.sendRequest(`/salesOrder/create`, 'POST', data)
      .then((data) => {
        console.log(data)
         orderId = data.data.result[0];
        return utils.sendRequest(`/salesOrder/unifiedOrder`, 'POST', {
          id: orderId,
          userId:userId
        })
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
                console.log(orderId)
                wx.navigateTo({
                  url: `../paysuccess/paysuccess?id=${orderId}`,
                })
              },
              'fail': function (res) {
                  wx.showToast({
                    icon:'none',
                    title: '支付失败',
                  })
              },
              'complete': function (res) { }
            })
        }

      })
  },
  //点击选择地址
  goAddress: function() {
    wx.navigateTo({
      url: '../address/address?needAdd=true',
    })
  }
})