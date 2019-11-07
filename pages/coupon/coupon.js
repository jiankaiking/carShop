const app = getApp()
const util = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 0,
    couponItem:null
  },
  getIndex: function (e) {
    this.setData({
      navIndex: e.currentTarget.dataset.index
    })
    this.getCouponList(this.data.navIndex)
  },
  onLoad:function(){
    this.getCouponList(this.data.navIndex)
  },
  getCouponList:function(status){
    let that = this;
    util.sendRequest(`/personCoupon/havePersonCp`, 'POST', {
      userId:app.globalData.userId,
      status: status})
   .then(data=>{
     if (data.data.success) {
       console.log(data)
       that.setData({
         couponItem: data.data.result
       })
     }
   })
   
  },

})