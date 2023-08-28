const app = getApp()
const publicMethod = require('../../../../assets/js/publicMethod');

Page({
  data: {
    phone : '',
  },
  onLoad: function (options) {
    let that = this

    that.setData({
      phone:options.library_phone,
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

  },
/**调用电话 */
tel: function () {
  if (this.data.phone!=null){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  }else{
    app.showToast({
      title: "暂无联系电话"
    })
  }
},
})