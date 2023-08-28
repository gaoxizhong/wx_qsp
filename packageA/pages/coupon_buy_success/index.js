const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');

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

  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },

  //跳转我的优惠券
  gotomycoupon(){
    wx.navigateTo({
      url: '/packageA/pages/myCouponList/index',
    })
  }
})