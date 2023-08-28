const app = getApp()
const publicMethod = require('../../../../assets/js/publicMethod');

Page({
  data: {
    aaa:''
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      aaa:options.aaa,
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info')
    })
  },
  onShow: function() {
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  goToUseCoin() {
    wx.reLaunch({
      url: "/packageA/pages/receivearticle/infolist/index"
    })
  },

})