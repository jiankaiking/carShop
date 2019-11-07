const app = getApp()
var QQMapWX = require('../../../lib/qqmap-wx-jssdk.js');
const utils = require('../../../utils/requst.js')
var qqmapsdk;
Component({

  behaviors: [],

  properties: {

  },
  data: {
    itemIndex: 0,
    navTitle: [],
    itemNav0: [],
    swiperHeight: 0,
    titleId: '',
    swiperIndex: 0,
    domain: app.globalData.domain
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { 
    this.getGoodClass()
  },
  moved: function () { },
  detached: function () { },

  methods: {
    
    change: function () {
      this.triggerEvent('myevent', { paramBtoA: 123 });
    },
    //获取门店
    getStroe: function (latitude, longitude) {
      var that = this

      utils.sendRequest(`/shop/getShopList`, 'POST', {
        latitude: latitude,
        longitude: longitude
      })
        .then(res => {
          console.log(res)
          if (res.data.success) {
            that.setData({
              storeItem: res.data.result
            })
          }
        })
    },

   
   
    //分类名字
    getGoodClass: function () {
      let domain = app.globalData.domain;
      let that = this;
      wx.request({
        url: `${domain}/classify/queryClassify2ByMainId?id=ec3d1100e1f578442f0a9085f1e62b11`,
        method: 'GET',
        success: function (data) {
          if (data.data.success) {
            console.log(data)
            that.setData({
              navTitle: data.data.result,
            })
            that.getGoods(data.data.result[0].id)
          }
        }
      })
    },
    //分享页面
    goStore: function (e) {
      let storeId = e.currentTarget.dataset.id;

      wx.navigateTo({
        url: `../productMsg/productMsg?id=${storeId}`,
      })
    },
    //分类商品
    getGoods: function (id) {
      let domain = app.globalData.domain;
      let shopid = id;
      let that = this;
      console.log(id)
      wx.request({
        url: `${domain}/good/queryByclassify?classify=${shopid}`,
        method: 'GET',
        success: function (data) {
          console.log(data)
          if (data.data.success) {
            that.setData({
              itemNav0: data.data.result
            })
          }
        }
      })
    },
    //点击加载
    itemTable: function (e) {
      let id = e.currentTarget.dataset.id;
      this.setData({
        itemIndex: e.currentTarget.dataset.index
      })
      this.getGoods(id)
    },
    //固定顶部
    titleFixed: function () {
      var that = this;
      var query = wx.createSelectorQuery()
      query.select('.shopCont').boundingClientRect(function (res) {
        // console.log(res)
        if (res) {
          if (res.top <= 0) {
            that.setData({
              fixdFlage: true
            })
          } else {
            that.setData({
              fixdFlage: false
            })
          }
        }

      }).exec();
    },
    onPageScroll: function (e) {
      this.titleFixed()
    },
  }

})
