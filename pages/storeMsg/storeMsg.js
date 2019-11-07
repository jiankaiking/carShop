const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  data: {
    storeMsg:{},
    domain:app.globalData.domain + '/',
    recommendItem:[
     
    ]
  },
 onLoad:function(options){
   console.log(app.globalData.userId)
    let id = options.id;
    this.getGoods(id)
 },
 onShow:function(){
  
 },
  getGoods: function (id) {
    let domain = app.globalData.domain;
    let that = this;
    utils.sendRequest(`/good/findShopOrGood`, 'POST', {
      id: id
    })
    .then(data=>{
      if (data.data.success) {
        that.setData({
          recommendItem: data.data.result.list,
          storeMsg: data.data.result.shop
        })
      }
    })
  },
  goproduct:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../productMsg/productMsg?id=${id}`,
    })
  },
})