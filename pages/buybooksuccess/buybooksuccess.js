const app = getApp()
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    point: '',
  },
  onLoad: function(options) {
    let that = this;
    that.audioCtx = wx.createInnerAudioContext();
    that.audioCtx.src = "/images/confirm.mp3";
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
    if ( options.point ) {
      that.setData({
        point: options.point,
      })
    }
  },
  onShow: function() {
    let member_id = wx.getStorageSync('member_id');
    let library_name = wx.getStorageSync("library_name");
    let books = JSON.parse(wx.getStorageSync("books"));
    if (!member_id) {
      // return//todo 备注:此处为了腾讯登录规则变化修改
    }
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
      library_name: library_name,
      books: books
    })
  },
  showmp3() {
      wx.reLaunch({
        url: "/pages/circle/circle"
      })
  },
  goToCircle() {
    console.log(111)
    wx.reLaunch({
      url: "/pages/circle/circle"
    })
  },
  onHide() {
  },
  onUnload() {
  },
})