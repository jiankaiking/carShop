const app = getApp()
var util = require('../../utils/util.js');
const utils = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: [],
    aindex: null,
    msgFlage: []
  },

  addFalge: function(arr) {
    arr.forEach(function(item) {
      return item.flage = false
    })
    return arr
  },

  onShow: function() {
    this.getQuestion()
  },
  //获取问题
  getQuestion: function() {
    let that = this;
 
    utils.sendRequest(`/userhelp/userHelpList`, 'POST', {})
      .then(res => {
        console.log(res)
        if (res.data.success) {
          that.setData({
            msg: res.data.result
          })
        }
      })

  },

  openAticr: function(e) {
    let index = e.currentTarget.dataset.aindex;
    var msg = this.data.msg;
    if (msg[index].flage == true) {
      msg[index].flage = !msg[index].flage;
    } else {
      this.addFalge(msg)
      msg[index].flage = !msg[index].flage;
    }
    this.setData({
      msg: msg
    })

  }
})