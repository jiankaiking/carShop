const app = getApp()
const utils = require('../../utils/requst.js')
Page({
  data: {
    city: '',
    address: '',
    name: '',
    phone: '',
    addressId: '',
    check: true,
    status: 0,
    fromFlage: 1
  },
  onLoad: function(options) {
    if (options.item != undefined) {
      let item = JSON.parse(options.item)
      console.log(item)
      this.setData({
        city: item.province,
        address: item.address,
        name: item.name,
        phone: item.phone,
        addressId: item.id,
        status: item.status,
        fromFlage: 0,
      })
    } else {
      this.setData({
        fromFlage: 1
      })
    }
    console.log(this.data.fromFlage)
  },
  onShow: function() {

  },
  getCity: function(e) {
    this.setData({
      city: e.detail.value
    })
  },
  getaddress: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //设置默认
  chuanggeStatus: function() {
    if (this.data.status == 0) {
      this.setData({
        status: 1
      })
    } else {
      this.setData({
        status: 0
      })
    }
  },


  //编辑地址
  upDateAdd: function() {
    let that = this;
    let {
      addressId,
      fromFlage,
      name,
      phone,
      city,
      address,
      status
    } = that.data
    let data = {
      userId: app.globalData.userId,
      id: addressId,
      name: name,
      phone: phone,
      province: city,
      address: address,
      status: status,
    }
    if (name == '') {
      this.showToast('请输入姓名')
      return
    } else if (phone == '') {
      this.showToast('请输入联系方式')
      return
    } else if (city == '') {
      this.showToast('请输入省市区地址')
      return
    } else if (address == '') {
      this.showToast('请输入详细地址')
      return
    }
    if (fromFlage == 0){
      utils.sendRequest(`/addressController/addressUpdate`, 'POST', data)
        .then(function (res) {
          if (res.data.success) {
            let pages = getCurrentPages()
            let prev = pages[pages.length - 2]
            prev.onLoad()
            wx.navigateBack({
              delta: 1
            })

          }
        })
    }else{
      utils.sendRequest(`/addressController/add`, 'POST', data)
        .then(function (res) {
          if (res.data.success) {
            let pages = getCurrentPages()
            let prev = pages[pages.length - 2]
            prev.onLoad()
            wx.navigateBack({
              delta: 1
            })
          }
        })
    }
    
  },

  showToast: function (params) {
    wx.showToast({
      title: params,
      icon: 'none',
      duration: 2000
    })

  }

})