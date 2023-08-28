const app = getApp()
const publicMethod = require('../../../assets/js/publicMethod');

Page({
  data: {
  },
  onLoad: function(options) {
    let that = this
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info')
    })
  },
  onShow: function() {
    let that = this
    that.setData({
      visited_at: wx.getStorageSync("visited_at"),
      garden: wx.getStorageSync("garden"),
    })
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  //跳转送书页面
  goToUseCoin() {
    wx.reLaunch({
      url: "/pages/book_store/book_store?type=songshu"
    })
  },
   //跳转去首页
   goToUseCoinaa() {
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
  //前往环保圈
  goToCircle() {
    wx.reLaunch({
      url: "/pages/circle/circle"
    })
  },
  //分享
  onShareAppMessage: function (res) { //分享
    let that = this  
    console.log(res);
    let title = that.data.visited_at + "分,我在" +that.data.garden + '呼叫了上门回收,你也一起吧...!'
    if (res.from === 'button') {
      return {
        title: title,
        path: "/pages/index/index",
        imageUrl: 'http://oss.qingshanpai.com/huanbaobi/d8dbf9dfbe939cdfd6876a32cf3779d8.png',
        success: function (res) {
          // 转发成功
          console.log(res)
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    return {
      title: '青山生态',
      imageUrl: 'http://oss.qingshanpai.com/huanbaobi/3bac43d484c4a8c8117ce4b9265c55e9.png',
      path: "/pages/index/index",
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
})