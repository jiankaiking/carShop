const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchMsg:'',
    searchHistory:[],
    hotSearch:[],
  },
  inputvalue:function(e){
    this.setData({
      searchMsg: e.detail.value
    })
  },
  onLoad:function(options){
    this.getSearchHistory()
  },
  //清空搜索记录
  clearSearch:function(){

    let userId = app.globalData.userId;
    let that = this;
    utils.sendRequest(`/search/delletSearch`, 'POST', { id: userId })
    .then((res)=>{
      that.getSearchHistory()
    })
  },
  //搜索记录
  getSearchHistory:function(){
    let userId = app.globalData.userId;
    let that = this;
    utils.sendRequest(`/search/getSearch`, 'POST', { id: userId})
    .then((res)=>{
      if(res.data.success){
        this.setData({
          searchHistory: res.data.result.searches,
          hotSearch: res.data.result.reMen
        })
      }
    })
  },
  goSearch:function(e){
    let keyword = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `../searchmsg/searchmsg?keyword=${keyword}`,
    })
  },
  //点击搜索
  gosearchMsg:function(){
    let userId = app.globalData.userId;
    let that = this;
    let searchMsg = that.data.searchMsg
    utils.sendRequest(`/search/addSearch`, 'POST', { userId: userId, keyword: searchMsg})
    .then((res)=>{
      if(res.data.success){
        wx.navigateTo({
          url: `../searchmsg/searchmsg?keyword=${searchMsg}`,
        })
      }
    })
    
  },
})