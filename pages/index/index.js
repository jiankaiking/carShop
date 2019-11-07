const app = getApp()
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
const utils = require('../../utils/requst.js')
const util = require('../../utils/util.js')
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeItem: [],
    swiperIndex: 0,
    business: [],
    common: [],
    userId: app.globalData.userId,
    domain: app.globalData.domain,
    locateCity: '获取地址'
  },

  

  onLoad: function() {

    if (app.globalData.userId == null) {
      this.getUeserInfor()
    }
    this.getLocate()
    this.getBanner()
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.getLocate()
    this.getBanner()
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000)
  },
  onShow: function() {
   
  },

  
  click: function() {
    var that = this;
    wx.scanCode({
      success: (res) => {
        let result = JSON.parse(res.result)
        console.log(result)
        if (result.state == 0) {
          wx.navigateTo({
            url: `../pay/pay?result=${result.id}`,
          })
        } else {
          wx.navigateTo({
            url: `../addvip/addvip?result=${result.id}`,
          })
        }
      },
      fail: (res) => {}
    })
  },
  goCoupon: function (e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;

    let advItem = type == 0 ? this.data.common[index] : this.data.business[index]
    console.log(advItem)
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
  getBanner: function() {
    let that = this;
    utils.sendRequest(`/advertising/queryWheel`, 'POST', {})
      .then(res => {
       
        if (res.data.success) {
          let result = res.data.result;
          let common = result.common[0].concat(result.common[1])
         
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
  gosearch: function() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  //门店详情
  gostoreMsg: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../storeMsg/storeMsg?id=${id}`,
    })
  },
  leftPrev: function() {
    let {
      storeItem,
      business,
      swiperIndex
    } = this.data;

    this.setData({
      swiperIndex: swiperIndex <= 0 ? business.length - 1 : swiperIndex -= 1
    })

  },
  rightPrev: function() {
    let {
      storeItem,
      business,
      swiperIndex
    } = this.data;

    this.setData({
      swiperIndex: swiperIndex >= business.length - 1 ? 0 : swiperIndex += 1
    })

  },
  //点击地位地址
  goMap: function() {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        that.getAddress(res.latitude, res.longitude)
      },
    })
  },
  //获取门店
  getStroe: function(latitude, longitude) {
    var that = this

    utils.sendRequest(`/shop/getShopList`, 'POST', {
        latitude: latitude,
        longitude: longitude
      })
      .then(res => {
     //   console.log(res)
        if (res.data.success) {
          that.setData({
            storeItem: res.data.result
          })
        }
      })
  },

  //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
  getAddress: function(latitude, longitude) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(addressRes) {
   //     console.log("addressRes", addressRes);
        const addressCity = addressRes.result.ad_info.city;
        const addressDistrict = addressRes.result.ad_info.district;
        const address = addressCity + addressDistrict;
        //    console.log("市：" + addressCity, "区：" + addressDistrict);
        that.setData({
          locateCity: addressCity
        });
      },
      fail(data) {
       // console.log(data)
      }
    })
  },
  //获取位置
  getLocate: function() {
    const that = this;
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: '33GBZ-FC5CS-XDIOQ-6T4YO-FW3N5-IIFE5' //申请的key
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84', // GPS坐标    // type: 'gcj02', 火星坐标
      success: function(res) {
        // console.log(res);
        //根据经纬度获取附近的门店
        that.getStroe(res.latitude, res.longitude)
        that.getAddress(res.latitude, res.longitude)

      }
    })
  },
  //获取用户信息
  getUeserInfor: function() {
    var that = this;
    let domain = app.globalData.domain
    wx.getStorage({
      key: 'id',
      success: function(res) {
        utils.sendRequest(`/wchatUser/getUser`, 'POST', {
            id: res.data
          })
          .then(res => {
            let result = res.data.result
            if (res.data.success) {
              app.globalData.userInfo = result
              app.globalData.userId = result.id

              that.setData({
                pic: result.avatar,
                name: result.nick,
                domain: app.globalData.domain
              })
            }
          })
      },
      fail: function() {
        that.setData({
          userFlag: true
        })
      }
    })
  },
  //分享按钮
  onShareAppMessage: function(options) {　　
    var that = this;
    var shareObj = {　　　　
      title: "车道善", 
      path: '/pages/index/index',
      imageUrl: '',
      success: function(res) {　　　　
          if (res.errMsg == 'shareAppMessage:ok') {
          }　　　　
      }
    }  　　
    return shareObj;
  }
})