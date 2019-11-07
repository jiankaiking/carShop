const app = getApp()
const utils = require('../../utils/requst.js')
Page({
  data: {
    len: 0,
    imgContUrl: [],
    abb: ['132', '321321', '321321312'],
    domain: app.globalData.domain,
    startUrl: "../public/start.png",
    startLink: "../public/activeS.png",
    goodId: null,
    value:'',
    id: null,
    vidos: null,
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      goodId: options.goodId,
      id: options.id,
    })
  },
  bindtext:function(e){
    
    this.setData({
      value: e.detail.value
    })
  },
  //提交评论
  addEsmit: function() {
    let that = this;
    let userId = app.globalData.userId;
    let imgs = that.data.imgContUrl.join(',')
   
    let data = {
      goodId: that.data.goodId,
      userId: userId,
      commentXin: that.data.len,
      imgs: imgs,
      orderId: that.data.id,
      viode: that.data.vidos,
      comment: that.data.value,
      userName: app.globalData.userInfo.nick
    }


    utils.sendRequest(`/comment/saveComment`, 'POST', data)
      .then(res => {
        if(res.data.success){
          wx.navigateBack({
            delta:1
          })
        }
      })
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
            imgcont.push(cont)
            that.setData({
              imgContUrl: imgcont
            })

          }
        })
      }
    })
  },
  addVideo: function() {
    let that = this;
    let domain = app.globalData.domain;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        let vUrl = res.tempFilePath;
        wx.uploadFile({
          url: `${domain}/sys/common/upload`,
          filePath: vUrl,
          name: 'file',
          success: function(data) {
            let con = JSON.parse(data.data)
            let cont = con.message
            that.setData({
              vidos: cont
            })
          }
        })

      }
    })
  }
})