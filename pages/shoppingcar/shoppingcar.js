const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  data: {
    aggregate: 0.00,
    allCheck: false,
    goodsItem: [],
    domain: app.globalData.domain + '/',
    admin: false
  },
  onLoad: function() {
    this.getShopingCar()
  },

  //删除选择购物车
  deleteCart: function() {
    let idString = [] //选择的goods
    let that = this;
    let goodsItem = that.data.goodsItem;

    goodsItem.filter(function(item, index) {
      if (item.falge == true) {
        idString.push(item.id)
      }
    })


    if (idString == '') {
      return
    } else {
      utils.sendRequest(`/shoppingCart/delShoppingCart`, 'POST', {
          cartId: idString.join(',')
        })
        .then(function(response) {
          console.log(response)
          if (response.data.success) {
            that.getShopingCar()
          }
        }, function(error) {
          console.log(error);
        })
    }
  },
  //獲取購物車
  getShopingCar: function() {
    let that = this;
    let userId = app.globalData.userId;

    utils.sendRequest(`/shoppingCart/getShoppingCart`, 'POST', {
        id: userId
      })
      .then(function(response) {

        if (response.data.success) {
          //增加总金额
          response.data.result.map(item => {
            return item.price = parseFloat((item.freight + item.serviceCharge).toFixed(2))
          })
          that.setData({
            goodsItem: response.data.result
          })
          console.log(response.data.result)
        }
      }, function(error) {
        console.log(error);
      })
  },




  gopay: function() {
    let that = this;
    let arr = that.data.goodsItem;
    if(arr.length == 0){
      wx.showToast({
        title: '购物车还是空的，去添加商品吧',
        icon:'none'
      })
      return
    }
    let userId = app.globalData.userId;
    let b = arr.filter(item => {
      return item.falge == true
    })
    let idArr = [];
    let data = {
      salerList: []
    };

    for (let i = 0; i < b.length; i++) {
      console.log(b.self_mention)
      let salerList = {
        userId: userId, //用户id
        //selfMention: b.self_mention,
        freight: b[i].freight, //运费
        serviceCharge: b[i].serviceCharge, //服务费
        type: b[i].type,
        shoppingId: b[i].id,
        goodId: b[i].goodId,
        userImg: app.globalData.userInfo.avatar,
        status: 1,
        name: b[i].name,
        phone: b[i].phone,
        address: b[i].address,
        shopId: b[i].shopId,
        goodNum: b[i].goodNum,
        goodName: b[i].goodName,
        goodImg: b[i].goodImg,
        goodSpecification: b[i].goodSpecification,
      }
      data.salerList.push(salerList)
    }
    utils.sendRequest(`/salesOrder/create`, 'POST', data)
      .then((res) => {
        let orderId = res.data.result.join(',')
        return utils.sendRequest(`/salesOrder/unifiedOrder`, 'POST', {
          userId: userId,
          video: orderId
        })
      })
      .then(res => {
        if (res.data.result) {
          let paymsg = res.data.result
          wx.requestPayment({
            'timeStamp': paymsg.timeStamp,
            'nonceStr': paymsg.nonceStr,
            'package': paymsg.packageStr,
            'signType': paymsg.signType,
            'paySign': paymsg.paySign,
            'success': function(res) {
              console.log(res)
              wx.showToast({
                title: '支付成功',
                icon: 'none'
              })
              that.getShopingCar()
            },
            'fail': function(res) {

            },
            'complete': function(res) {}
          })
        }
      })
  },
  delete: function() {
    console.log(2)
  },
  onShow: function() {
    let arr = this.data.goodsItem;
    arr.filter(function(item) {
      return item.falge = false
    })
    this.setData({
      goodsItem: arr
    })
  },
  //点击管理
  checkAdmin: function() {
    this.setData({
      admin: !this.data.admin,
      allCheck: true,
    })
    this.allcheck()
  },
  //点击按钮 
  checkedBtn: function(e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.goodsItem;
    arr[index].falge = !arr[index].falge
    let f = arr.every(function(item) {
      return item.falge == true
    })
    this.setData({
      goodsItem: arr,
      allCheck: f
    })
    this.getPrice(arr)
  },
  //全选按钮
  allcheck: function() {
    let allCheck = this.data.allCheck;
    let arr = this.data.goodsItem;
    if (allCheck == false) {
      arr.filter(function(item) {
        return item.falge = true
      })
      this.setData({
        goodsItem: arr,
        allCheck: !allCheck
      })
    } else {
      arr.filter(function(item) {
        return item.falge = false
      })
      this.setData({
        goodsItem: arr,
        allCheck: !allCheck
      })
    }
    this.getPrice(arr)
  },

  //获取总价
  getPrice: function(arr) {
    let a = arr;
    let moneyC = []
    let newarr = a.filter(function(item) {
      return item.falge == true
    })
    newarr.forEach(function(a) {
      moneyC.push(a.price)
    })
    // console.log(newarr)
    if (newarr == '') {
      this.setData({
        aggregate: 0.00
      })
      return

    } else {
      let money = moneyC.reduce((a, b) =>
        a + b
      )
      
      this.setData({
        aggregate: money.toFixed(2)
      })
    }

  }
})