const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    domain:app.globalData.domain,
   img:null
  },

  onLoad: function (options) {
    this.getImg()
  },
  getImg:function(){
    let that = this;
    utils.sendRequest(`/customer/list`, 'GET', {})
    .then(res=>{
      that.setData({
        img: res.data.result.records[0].img
      })
    })
  },
})