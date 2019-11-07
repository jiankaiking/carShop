const app = getApp()
const utils = require('../../utils/requst.js')
Page({
  data: {
    len: 0,
    imgContUrl: [],
    abb: ['132', '321321', '321321312'],
    domain: app.globalData.domain,
    advId: null,
    advMsg: null,
    type: null,
  },
  onLoad: function() {
    this.getAdvMsg()
  },
  //重新提交
  resBtn: function() {
    this.setData({
      advMsg: null,
      imgContUrl: [],
    })
  },
  radioChange: function(e) {

    this.setData({
      type: e.detail.value
    })
  },
  setTime: function() {
    let that = this;

    that.data.timer = setInterval(function() {
      var n = that.data.timerArr;

      for (var z = 0; z < n.length; z++) {
        var arrnum = n[z];
        n[z] = arrnum + 1
      }
      that.setData({
        timerArr: n
      })
    }, 1000)
  },
  imgTap: function(e) {
    this.setData({
      len: e.currentTarget.dataset.index
    })
  },
  addImg: function() {
    let that = this;
    let domain = app.globalData.domain;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: `${domain}/sys/common/upload`,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function(data) {
            let imgcont = that.data.imgContUrl
            let con = JSON.parse(data.data)
            let cont = con.message
            that.setData({
              imgContUrl: cont
            })
          }
        })
      }
    })
  },
  sbmitAdv: function() {
    let that = this;
    let userId = app.globalData.userId;
    let advmsg = that.data.advMsg;
    let advId = that.data.advId;
    let data = {
      userId: userId,
      userType: '1',
      type: that.data.type,
      picture: that.data.imgContUrl
    }
    console.log(advId)
    if (advId != null || advId == undefined) {
      data.advertisingId = advId
    }
    utils.sendRequest(`/advertisingApply/add`, 'POST', data)
      .then(function(res) {
      
        that.onLoad()
      })
  },

  //广告信息
  getAdvMsg: function() {
    let that = this;
    let userId = app.globalData.userId;
    let data = {
      userType: 1,
      userId: userId
    }
    utils.sendRequest(`/advertising/queryByIdAndType`, 'POST', data)
      .then((res) => {
        if (res.data.success) {
          if (res.data.result != null) {
            that.setData({
              advId: res.data.result.id,
            })
          }
          utils.sendRequest(`/advertisingApply/queryByUserId`, 'POST', data)
            .then((res) => {
              console.log(res)
              if (res.data.success) {
                if (res.data.result != null) {
                  if (res.data.result.status != undefined) {
                    let imgcont = []
                    imgcont.push(res.data.result.picture)
                    that.setData({
                      advMsg: res.data.result,
                      imgContUrl: imgcont,
                      type: res.data.result.type,
                    })
                  }
                }
              }
            })
        }
      })

  },
  deletImg: function() {
    this.setData({
      imgContUrl: []
    })
  }
})