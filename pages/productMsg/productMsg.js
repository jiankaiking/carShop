// pages/productMsg/productMsg.js
const app = getApp()
const utils = require('../../utils/requst.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnFlage: false,
    numtenFlage: 0,
    projectFlage: true,
    storeShow: false,
    goods: [],
    optionsIndex: null,
    specification: '',
    optionsG: '', //商品规格
    addCarflage: true,
    goWhat: false,
    projectNum: 1, //数量
    productId: null,

    storeCont: [],
    clientPhone: '请输入联系方式',
    clientName: null,
    clientMsg: false,
    startUrl: "../public/start.png",
    startLink: "../public/activeS.png",
    storeMsg: null,
    esimitame: [],
    esimage: [],
    pageSize: 4, //评论加载数量
    pageNo: 1, //评论开始
    bannerCont: null,
    self_mention: null, //预留时间
    domain: app.globalData.domain,
    loginFalge: true,
    addressCont: null, //地址
    type: null //订单类型
  },
  onLoad: function(options) {
    // console.log(this.data.domain)
    let id = options.id;
    this.setData({
      productId: id
    })
    this.getGoodsMsg(id)
  },
  onShow: function() {
    

    if (this.data.numtenFlage == this.data.goods.share) {
      this.clearBtn()
    }
  },

  //关闭
  loginClose:function(e){
    console.log(e)
    this.setData({
      loginFalge: e.detail
    })
  },
  //时间预留
  bindDateChange: function(e) {
    this.setData({
      self_mention: e.detail.value
    })
  },

  //电话预留
  showclent: function() {
    this.setData({
      clientMsg: true
    })
  },
  clientPhone: function(e) {
    this.setData({
      clientPhone: e.detail.value
    })
  },
  clientName: function(e) {
    this.setData({
      clientName: e.detail.value
    })
  },
  tureClient: function() {
    this.setData({
      clientMsg: false,
    })
  },
  clearClient: function() {
    this.setData({
      clientMsg: false,
      clientPhone: '请填写联系方式'
    })
  },
  //点击选择地址
  goAddress: function() {
    wx.navigateTo({
      url: '../address/address?needAdd=true',
    })
  },
  //获取商品详情
  getGoodsMsg: function(goodsId) {
    let that = this;
    let id = goodsId;
    let domain = app.globalData.domain;
    wx.request({
      url: `${domain}/good/queryById?id=${id}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          console.log(res)
          that.setData({
            goods: res.data.result,
            specification: res.data.result.specification.split(','),
            bannerCont: res.data.result.goodImg.split(','),
          })
          let {
            goods,
            pageSize,
            pageNo
          } = that.data;
          let goodId = goods.id;
          let pageSiz = pageSize;
          let pageN = pageNo;
          //that.getEsmitate(goodId, pageSiz, pageN)
        }
      }
    })
  },

 
  onReachBottom: function() {
    let that = this;
    let {
      goods,
      pageSize,
      pageNo
    } = that.data;
    let goodId = goods.id;
    let pageSiz = pageSize;
    let pageN = pageNo + 1;

    this.getEsmitate(goodId, pageSize, pageNo)
    this.setData({
      pageNo: pageN
    })

  },
  //获取评论
  getEsmitate: function(goodId, pageSize, pageNo) {
    let that = this;
    utils.sendRequest(`/comment/commentList`, 'GET', {
        goodId,
        pageSize,
        pageNo
      })
      .then(response => {
        if (response.data.success) {
          let esmitArr = that.data.esimitame
         
          let resArr2 = []
          response.data.result.records.map(((item, index) => {
            resArr2.push(Object.assign({}, item, { imgs: item.imgs.split(',')}))
          }))
         
          that.setData({
            esimitame: esmitArr.concat(resArr2),
          })
        }
      })
  },
  //点击规格
  getSpecification: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      optionsIndex: index
    })
    console.log(index)
  },
  //选择门店
  openStore: function() {
    this.setData({
      storeShow: true
    })
    let id = this.data.goods.id;
    let that = this;
    utils.sendRequest(`/good/findShopGood`, 'POST', {
        id: id
      })
      .then((res) => {
        console.log(res)
        if (res.data.success) {
          that.setData({
            storeCont: res.data.result
          })
        }
      })

  },
  //门店点击
  optionsStore: function(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.setData({
      storeMsg: this.data.storeCont[index],
      storeShow: false
    })
  },
  //送货方式
  opway: function(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      type: type
    })
  },
  //点击领取
  svaepay: function() {
    if(app.globalData.userId == null){
      this.setData({
        loginFalge: false
      })
    }else{
      this.setData({
        loginFalge: true,
        addCarflage: false,
        btnFlage: true
      })
    }
  },
  clearBtn: function() {
    this.setData({
      btnFlage: false,
      addCarflage: true
    })
  },
  backPages: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //点击背景
  bgcClick: function() {
    this.setData({
      storeShow: false,
      btnFlage: false,
      addCarflage: true,
      projectFlage: true
    })
  },
  //点击-
  downNum: function() {

    this.setData({
      projectNum: this.data.projectNum <= 1 ? 1 : this.data.projectNum -= 1
    })
  },
  //点击加
  addNum: function() {
    this.setData({
      projectNum: this.data.projectNum += 1
    })
  },
  //关闭按钮
  closeP: function() {
    this.setData({
      storeShow: false,
      clientMsg: false,
      addCarflage: true,
      projectFlage: true
    })
  },
  //加入购物车按钮
  addCar: function() {
    this.setData({
      goWhat: true,
      addCarflage: false,
      projectFlage: false
    })
  },
  //立即购买
  gopay: function() {
    this.setData({
      goWhat: false,
      addCarflage: false,
      projectFlage: false
    })
  },
  //点击分享
  onShareAppMessage: function(res) {
    let that = this;
     console.log(that.data.goods)
    utils.sendRequest(`/share/add`, 'POST', {
      userId:app.globalData.userId,
      goodsId: that.data.goods.id
    })
    .then(res=>{
      console.log(res)
    })
    let { numtenFlage } = that.data;
    if (res.from === 'button') {
      that.setData({
        numtenFlage: numtenFlage + 1
      })
     
    }
    return {
      title: '转发',
      desc: '江湖救急，还请贵人伸手相助啊!',
      imageUrl: "../public/vip.png",
      path: '/pages/index/index'
    }
  },

  //加入购物车确认按钮
  addCart: function() {
    let that = this;

    let userId = app.globalData.userId;
    let {
      goWhat,
      type,
      addressCont,
      storeMsg,
      projectNum,
      clientName,
      clientPhone,
      self_mention,
      goods,
      specification,
      optionsIndex
    } = that.data;
    let stringItem = {
      type,
      addressCont,
      self_mention,
      optionsG: specification[optionsIndex],
      storeMsg,
      projectNum,
      goods
    }
    if (type == null) {
      this.showToast('选择送货方式')
      return
    } else if (optionsIndex == null) {
      this.showToast('选择规格')
      return
    } else if (storeMsg == null) {
      this.showToast('选择门店')
      return
    } else if (type == 2 && clientName == null) {
      this.showToast('门店自提选择联系方式')
      return
    } else if (type == 2 && clientPhone == '请输入联系方式') {
      this.showToast('门店自提选择联系方式')
      return
    } else if (type == 2 && self_mention == null) {
      this.showToast('门店自提选择预留时间')
      return
    } else if (type == 1 && addressCont == null) {
      this.showToast('选择邮寄地址')
      return
    }
    if (goWhat){
      let data = {
        userId: userId,
        selfMention: self_mention,
        freight: goods.freight,
        serviceCharge: goods.reduced,
        type: type,
        name: type == 2 ? clientName : addressCont.name,
        phone: type == 2 ? clientPhone : addressCont.phone,
        address: type == 2 ? storeMsg.address : addressCont.address,
        shopId: storeMsg.id,
        shopName: storeMsg.name,
        userImg: app.globalData.userInfo.avatar,
        goodId: goods.id,
        goodNum: projectNum,
        goodName: goods.title,
        goodImg: goods.coverImg,
        goodSpecification: specification[optionsIndex]
      }

      utils.sendRequest(`/shoppingCart/addCart`, 'POST', data)
        .then((res) => {
          if(res.data.success){
            wx.showToast({
              title: '去购物看看吧',
              icon:'none',
              success:function(){
                that.bgcClick()
              }
            })
          }
        })

    }else{
      let data = {
        salerList: [{
          userId: userId, //用户id
          selfMention: self_mention,
          freight: goods.freight, //运费
          serviceCharge: goods.reduced, //服务费
          type: type,
          goodId: goods.id,
          userImg: app.globalData.userInfo.avatar,
          status: 1,
          name: type == 2 ? clientName : addressCont.name,
          phone: type == 2 ? clientPhone : addressCont.phone,
          address: type == 2 ? storeMsg.address : addressCont.address,
          shopId: storeMsg.id,
          goodNum: projectNum,
          goodName: goods.title,
          goodImg: goods.coverImg,
          goodSpecification: specification[optionsIndex]
        }]
      }
      let itemData = JSON.stringify(data)
      wx.navigateTo({
        url: `../getGoods/getGoods?stringItem=${itemData}`,
      })
    }
  },
 
  showToast: function(params) {
    wx.showToast({
      title: params,
      icon: 'none',
      duration: 2000
    })

  }
})