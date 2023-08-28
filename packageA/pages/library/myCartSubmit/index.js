const app = getApp()
const publicMethod = require('../../../../assets/js/publicMethod');

Page({
  data: {
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info')
    })
  },
  onShow: function () {
    let that = this
    that.setData({
      visited_at: wx.getStorageSync("visited_at"),
      garden: wx.getStorageSync("garden"),
    })
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  //跳转我的订单
  goToUseCoin() {
    wx.navigateTo({
      url: "/pages/myDicountOrder/myDicountOrder?type=1"
    })
  },
  // 跳转到环保银行
  goTocircle(){
    wx.reLaunch({
      url: "/pages/bank/bank"
    })
  },
  //前往我的购物车
  goToCircle() {
    wx.reLaunch({
      url: "/packageA/pages/library/myCart/index?member_id=" + wx.getStorageSync('member_id'),
    })
  },
})