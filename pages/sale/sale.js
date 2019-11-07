// pages/sale/sale.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     saleId:null,
     
  },
  onLoad:function(options){
     this.setData({
       saleId: options.id
      
     })
  },
  gosalemsg:function(e){
    let type = e.currentTarget.dataset.type;
    let id = this.data.saleId
   
    wx.navigateTo({
      url: `../salemsgone/salemsgone?id=${id}&type=${type}`,
    })
  },
 
})