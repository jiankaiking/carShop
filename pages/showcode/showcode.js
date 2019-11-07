// pages/showcode/showcode.js
const QR = require('../../utils/qrcode.js')
Page({

  data: {

  },
  onShow:function(){
    this.createQrCode('www.baidu.com', 'mycanvas', 300, 300)
  },
  createQrCode: function (content, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(content, canvasId, cavW, cavH);
    this.canvasToTempImage(canvasId);
  },

  //获取临时缓存图片路径，存入data中
  canvasToTempImage: function (canvasId) {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId,   // 这里canvasId即之前创建的canvas-id
      success: function (res) {
        let tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({       // 如果采用mpvue,即 this.imagePath = tempFilePath
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  }
})