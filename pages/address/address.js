// pages/address/address.js
const app = getApp()
const utils = require('../../utils/requst.js')

Page({

  data: {
    addressItem:[],
    needAdd:false,
  },
 onLoad:function(options){
 
   if (options !== undefined && Object.getOwnPropertyNames(options).length != 0){
     this.setData({
       needAdd: options.needAdd
     })
   }

   this.getAddress()
 },
  onShow:function(){
   
   
  },
  //点击返回地址
  backAdd:function(e){
    let index = e.currentTarget.dataset.index;
    let item = this.data.addressItem[index];
    let pages = getCurrentPages()
    let prver = pages[pages.length - 2]
    prver.setData({
      addressCont: item
    })
    wx.navigateBack({
      delta:1
    })
  },
  //点击默认
  checkImg:function(e){
    let status = e.currentTarget.dataset.status == 0?1:0;
    let userId = app.globalData.userId;
    let id = e.currentTarget.dataset.id;
    let that = this;
    utils.sendRequest(`/addressController/addressUpdate`, 'POST', {
      id: id,
      status: status,
      userId: userId,})
    .then(res=>{
      if (res.data.success) {
        that.getAddress()
      }
    })
  },
  //删除地址
  deletAddress:function(e){
     
     let that= this;
    let addId = e.currentTarget.dataset.id;
    let domain = app.globalData.domain;
    console.log(addId)
    wx.request({
      url: `${domain}/addressController/addressDelete?id=${addId}`,
      method:'GET',
      
      header:{
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.data.success){
          that.getAddress()
        }
      }
    })
  },
  //获取地址列表
  getAddress:function(){
    const userId = app.globalData.userId
    let domain = app.globalData.domain;
      let that = this;
      wx.request({
        url: `${domain}/addressController/addressList?userId=${userId}`,
        method:'GET',
        success:function(data){
          if(data.data.success){
            that.setData({
              addressItem:data.data.result
            })
          }
        }
      })
  }, 
  /* =============  新建地址  ============== */
  goNewaddress:function(){
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
  },
  /* =============  编辑地址  ============== */
  goUpdataAdd: function (e) {
    var item = e.currentTarget.dataset.item;
    item = JSON.stringify(item)
    wx.navigateTo({
      url: `../newAddress/newAddress?item=${item}`,
    })
  },
})