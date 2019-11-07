
const app = getApp()
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
const utils = require('../../utils/requst.js')
var qqmapsdk;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    itemIndex:0,
    swiperIndex:0,
    navTitle:[],
    itemNav0:[],
    business: [],
    common: [],
    locateCity: '获取地址',
    swiperHeight:0,
    titleId:'',
    domain:app.globalData.domain
  },
  onLoad: function () {
    if (app.globalData.city == null) {
      this.getLocate()
    }
    this.getGoodClass()
    this.getBanner()
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getLocate()
    this.getBanner()

    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000)
  },
  onShow: function () {
   
  },
  click:function(){
    wx.navigateTo({
      url: '../shoppingcar/shoppingcar',
    })
  },
  goCoupon: function (e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;

    let advItem = type == 0 ? this.data.common[index] : this.data.business[index]
  //  console.log(advItem)
    if (type == 1 && index == 0) {
      wx.navigateTo({
        url: '../couponSave/couponSave',
      })
      return
    }
    if (advItem.goodId != '' && advItem.goodId != null) {
      wx.navigateTo({
        url: `../productMsg/productMsg?id=${advItem.goodId}`,
      })
      return
    }
    if (advItem.shopId != null && advItem.shopId != '') {
      wx.navigateTo({
        url: `../storeMsg/storeMsg?id=${advItem.shopId}`,
      })
      return
    }
  },
  getBanner: function () {
    let that = this;
    utils.sendRequest(`/advertising/queryWheel`, 'POST', {})
      .then(res => {
    //    console.log(res)
        if (res.data.success) {
          let result = res.data.result;
          let common = result.common[0].concat(result.common[1])
        //  console.log(common)
          that.setData({
            common: common,
            business: result.business
          })
        }
        return utils.sendRequest(`/adverti/getImg`, 'POST', {})
      })
      .then(res => {
        if (res.data.result) {
          that.data.business.unshift(res.data.result[0])
          that.setData({
            business: that.data.business
          })
        }
      })
  },
  //搜索界面
  gosearch: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  
 
  //点击地位地址
  goMap: function () {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        that.getAddress(res.latitude, res.longitude)
      },
    })
  },
  

  //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
  getAddress: function (latitude, longitude) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (addressRes) {
      //  console.log("addressRes", addressRes);
        const addressCity = addressRes.result.ad_info.city;
        const addressDistrict = addressRes.result.ad_info.district;
        const address = addressCity + addressDistrict;
        //    console.log("市：" + addressCity, "区：" + addressDistrict);
        app.globalData.city = addressCity
        that.setData({
          locateCity: addressCity
        });
      },
      fail(data) {
        //console.log(data)
      }
    })
  },
  //获取位置
  getLocate: function () {
    const that = this;
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: '33GBZ-FC5CS-XDIOQ-6T4YO-FW3N5-IIFE5' //申请的key
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84', // GPS坐标    // type: 'gcj02', 火星坐标
      success: function (res) {
        // console.log(res);
        //根据经纬度获取附近的门店
        that.getAddress(res.latitude, res.longitude)

      }
    })
  },
  //分类名字
getGoodClass:function(){
  let domain = app.globalData.domain;
  let that = this;
  wx.request({
    url: `${domain}/classify/queryClassify2ByMainId?id=ec3d1100e1f578442f0a9085f1e62b11`,
    method: 'GET',
    success: function (data) {
      if(data.data.success){
       // console.log(data)
        that.setData({
          navTitle: data.data.result,
        })
        that.getGoods(data.data.result[0].id)
      }
    }
  })
},
//分享页面
  goStore:function(e){
    let storeId = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url:`../productMsg/productMsg?id=${storeId}`,
    })
  },
//分类商品
getGoods:function(id){
  let domain = app.globalData.domain;
  let shopid = id;
  let that = this;
 // console.log(id)
  wx.request({
    url: `${domain}/good/queryByclassify?classify=${shopid}`,
    method: 'GET',
    success: function (data) {
    //  console.log(data)
      if (data.data.success) {
        that.setData({
          itemNav0: data.data.result
        })
      }
    }
  })
},
//点击加载
  itemTable:function(e){
   
    let id = e.currentTarget.dataset.id;
    this.setData({
      itemIndex: e.currentTarget.dataset.index
    }) 
    this.getGoods(id)
  },

  
  leftPrev: function () {
    let {
      storeItem,
      business,
      swiperIndex
    } = this.data;

    this.setData({
      swiperIndex: swiperIndex <= 0 ? business.length - 1 : swiperIndex -= 1
    })

  },
  rightPrev: function () {
    let {
      storeItem,
      business,
      swiperIndex
    } = this.data;
  
    this.setData({
      swiperIndex: swiperIndex >= business.length - 1 ? 0 : swiperIndex += 1
    })

  },
//固定顶部
  titleFixed:function(){
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('.shopCont').boundingClientRect(function (res) {
     // console.log(res)
      if(res){
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
  onPageScroll:function(e){
    this.titleFixed()
  },
  //分享按钮
  onShareAppMessage: function (options) {
    var that = this;
    var shareObj = {
      title: "车道善",
      path: '/pages/huiyang/huiyang',
      imageUrl: '',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      }
    }
    return shareObj;
  }
})