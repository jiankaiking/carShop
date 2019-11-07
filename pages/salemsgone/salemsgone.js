const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      type:null,
      id:null,
      domain:app.globalData.domain,
    saleValue:'',
    imgContUrl:[],
  
  },

  getValue:function(e){
    console.log(e)
    this.setData({
      saleValue: e.detail.value
    })
    
  },
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      type:options.type,
      id:options.id
    })
    utils.sendRequest(`/salesOrder/findByOrder`, 'POST', { userId: app.globalData.userId, id: options.id })
      .then(res => {
        that.setData({
          goods: res.data.result,
        })
      })
  },
  saleOrder:function(){
    let { type, id, imgContUrl, saleValue} = this.data;
    let data = {
      id: id,
      returnRtype: type,
      refundReason: saleValue,
      credentials: imgContUrl.join(',')
    }
    utils.sendRequest(`/salesOrder/retureRefund`, 'POST', data)
    .then(res=>{
      wx.navigateBack({
        delta:2
      })
    })
  },
  addImg: function () {
    let that = this;
    let domain = app.globalData.domain;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: `${domain}/sys/common/upload`,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (data) {
            let imgcont = that.data.imgContUrl
            let con = JSON.parse(data.data)
            console.log(con)
            let cont = imgcont.concat(con.message)
            console.log(cont)
            that.setData({
              imgContUrl: cont
            })
          }
        })
      }
    })
  },
})