Page({

  data: {

  },
  onLoad: function (options) {
  },
  onShow: function () {

  },

  goto1: function(){
    wx.reLaunch({
      url: '/pages/myDicountOrder/myDicountOrder?type=1&status=',
    })
  },
  

  onShareAppMessage: function () {

  }
})