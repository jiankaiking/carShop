const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  data: {
    switchHeight: 0,
    tabIndex: 0,
    searchValue:'',
    tabNav: [],
    domain:app.globalData.domain,
    productItem: [

    ]
  },
  onLoad: function(options) {
    let keywords = options.keyword
    let query = wx.createSelectorQuery();
    query.select('.storeMsgNav').boundingClientRect(rect => {
      let clientHeight = rect.height;
      let clientWidth = rect.width;
      let ratio = 750 / clientWidth;
      let height = clientHeight * ratio;
      this.setData({
        switchHeight: height,
        searchValue: keywords
      })
    }).exec();
    this.getSearch(keywords)
  },
  //输入框输入
  getSearchValue:function(e){
    this.setData({
      searchValue: e.detail.value
    })
  },
  getSearch: function (keywords) {
   
    let userId = app.globalData.userId;
    let that = this;
    utils.sendRequest(`/good/findLikeGood`, 'POST', {
      title: keywords
      })
      .then(function(response) {
        console.log(response)
        that.setData({
          tabNav: response.data.result.classify2s,
          productItem: response.data.result.goods
        })
      })
      
  },
  getSearchgoods: function(title) {
    let domain = app.globalData.domain;
    let userId = app.globalData.userId;
    let that = this;
    utils.sendRequest(`/good/findClassifyGood`, 'POST', { title: title})
    .then((res)=>{
      console.log(res)
      that.setData({
        productItem: res.data.result
      })
      console.log(that.data.productItem)
    })
  },

  tabBind: function(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    let title = this.data.tabNav[e.currentTarget.dataset.index].name
    
    this.getSearchgoods(title)
    
  },
  bindchange: function(e) {
    this.setData({
      tabIndex: e.detail.current
    })
  },
  goShopcar: function() {
    wx.navigateTo({
      url: '../shoppingcar/shoppingcar',
    })
  },
  //商品详情
  goGoodsmsg:function(e){
    let index = e.currentTarget.dataset.index
    let id = this.data.productItem[index].id
    wx.navigateTo({
      url: `../productMsg/productMsg?id=${id}`,
    })
  },
})