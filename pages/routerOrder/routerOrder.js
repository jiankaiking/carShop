const app = getApp()
const util = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    routerOrder:[],
    doamin:app.globalData.domain + '/'
  },
 onLoad:function(){
   this.getRouterorder()
 },
  getRouterorder:function(){
    let that = this;
    util.sendRequest(`/shopOrder/getShopOrder`, 'POST', {
      userId: app.globalData.userId,
    })
    .then(res=>{
       that.setData({
         routerOrder:res.data.result
       })
    })
  },
})