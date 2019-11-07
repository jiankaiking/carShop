const app = getApp()
const util = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    advRecors:[]
  },
  onLoad: function() {
    this.getAdvList()
  },
  getAdvList: function() {
    let domain = app.globalData.domain;
    let userId = app.globalData.userId;
    let that = this;
    util.sendRequest(`/advertisement/list`, 'POST', {
      userId: userId,
      pageNo: 1,
      pageSize: 10
    })
    .then(res=>{
      console.log(res)
      if(res.data.success){
        that.setData({
          advRecors: res.data.result.records
        })
      }
    })
  }
})