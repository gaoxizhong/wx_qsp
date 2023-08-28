const app = getApp();
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');

let toViewInd = 0;
let time = common.formatTime(new Date());
let end_id = 0;
Page({
  data: {
    business_id: ''
  },

  onLoad: function(options) {
    let that = this;
    that.setData({
        member_id: wx.getStorageSync('member_id'),
        user_info: wx.getStorageSync('user_info'),
        configData: wx.getStorageSync('configData'),
    })
    if (options.id) {
      that.setData({
        business_id: options.id
      })
    }
  },
  goToMyOrder() {
    wx.navigateTo({
      url: "/pages/myDicountOrder/myDicountOrder?type=1&status="
    })
  },
  goToShop() {
    wx.navigateTo({
      url: "/pages/shop/shop?business_id=" + this.data.business_id
    })
  }
})