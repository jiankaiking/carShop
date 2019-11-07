// pages/advertising/advertising.js
const app = getApp()
const utils = require('../../utils/requst.js')
const date = new Date()
const years = []
const months = []
const days = []
for (let i = date.getFullYear(); i <= date.getFullYear() + 2; i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}

function mGetDate(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}
Page({

  data: {
    years: years,
    months: months,
    days: mGetDate(date.getFullYear(), date.getMonth()),
    sendTime: '投递时间',
    timeFlage: false,
    weekFlage: false,
    weekItem: [],
    weekIndex: null
  },

  onShow: function() {

  },
  onLoad: function(options) {
    this.getADDtimer()
    this.getAdvMsg()
  },
  //获取广告信息
  getAdvMsg: function () {
    let that = this;
    let userId = app.globalData.userId;
    utils.sendRequest(`/advertisingApply/queryByUserId`, 'POST', { userType: 1, userId: userId})
      .then(res => {
        console.log(222222222222)
        console.log(res)
        let result = res.data.result
        if(result == null){
          wx.showModal({
            title: '提示',
            content: '请进广告管理页面填写广告信息后既可购买广告',
            success: function (res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
                wx.navigateBack({
                  delta:1
                })
              } else {
                //点击确定
                wx.redirectTo({
                  url: '../advAdmin/advAdmin',
                })
              }
            }
          })
        }else{
          if (result.status != 1){
            wx.showModal({
              title: '提示',
              content: '请进广告管理页面填写广告信息审核通过后既可购买广告',
              success: function (res) {
                if (res.cancel) {
                  //点击取消,默认隐藏弹框
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  //点击确定
                  wx.redirectTo({
                    url: '../advAdmin/advAdmin',
                  })
                }
              }
            })
          }
        }
        
      })
  },
  //获取广告时间
  getADDtimer:function(){
      let that = this;
    utils.sendRequest(`/rulesCharge/listForBuy`, 'POST', {})
    .then(res=>{
      console.log(res)
      if (res.data.success) {
        that.setData({
          weekItem: res.data.result
        })
      }
    })
  },
  trueBtn:function(){
    let that = this;
    let userId = app.globalData.userId;
    let { weekItem, weekIndex, years, months, days, sendTime} = this.data;
    utils.sendRequest(`/advertisement/unifiedOrderTwo`, 'POST', {
      userId: userId,
      rulesId: weekItem[weekIndex].id,
      type: 1,
      userType: 1,
      startDate: sendTime})
     .then(r=>{
       if (r.data.success) {
         let paymsg = r.data.result
         console.log(paymsg)
         wx.requestPayment({
           'timeStamp': paymsg.timeStamp,
           'nonceStr': paymsg.nonceStr,
           'package': paymsg.packageStr,
           'signType': paymsg.signType,
           'paySign': paymsg.paySign,
           'success': function (dddd) {
             console.log(dddd)
           },
           'fail': function (res) {
           },
           'complete': function (res) { }
         })
       }
     })
  },

  /* ===========投递时间============= */
  optionTime: function() {
    this.setData({
      timeFlage: !this.data.timeFlage,
      weekFlage: false,
    })
  },
  bindChange: function(e) {
    const {
      years,
      months
    } = this.data;
    const val = e.detail.value
    let d = []
    for (var i = 1; i < mGetDate(years[val[0]], months[val[1]]) + 1; i++) {
      d.push(i)
    }
    this.setData({
      year: years[val[0]],
      month: months[val[1]],
      days: d,
      sendTime: years[val[0]] + '-' + months[val[1]] + '-' + d[val[2]]
    })
  },
  //取消按钮
  clearTime: function() {
    this.setData({
      sendTime: '投递时间',
      timeFlage: !this.data.timeFlage,
      weekFlage: false
    })
  },
  //确认按钮
  trueTime: function() {
    this.setData({
      timeFlage: !this.data.timeFlage,
      weekFlage: false
    })
  },
  /* ===========投递时长============= */
  optionWeek: function() {
    this.setData({
      weekFlage: !this.data.weekFlage,
      timeFlage: false,
    })
  },
  trueWeek: function(e) {
    console.log(e)
    this.setData({
      weekIndex: e.currentTarget.dataset.index,
      weekFlage: !this.data.weekFlage,
      timeFlage: false
    })
  }
})