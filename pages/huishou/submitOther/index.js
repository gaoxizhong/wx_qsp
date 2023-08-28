const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({
  data: {
    garbage_info:[],
    start_time:'',

  },
  onLoad: function(options) {
    console.log(options)
    console.log(app.data.garbage_info)
    let that = this
    let garbage_info = app.data.garbage_info;
    that.setData({
      garbage_info,
      member_id: wx.getStorageSync('member_id'),
      personData: wx.getStorageSync('user_info')
    })

  },
  onShow: function() {
    let that = this
    console.log(common.formatTime2(new Date()))
    this.setData({
      start_time: common.formatTime2(new Date())
    })
    let address_detail= wx.getStorageSync("address_detail");
    let visited_at= wx.getStorageSync("visited_at");
    let garden= wx.getStorageSync("garden");
    console.log(address_detail)
    that.setData({
      address_detail,
      visited_at,
      garden,
    })
  },
  getFormId(e) {
    publicMethod.getFormId(e, this)
  },
  //跳转去花环保币
  goToUseCoin() {
    wx.reLaunch({
      url: "/pages/usecoin/usecoin"
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
    // let title = that.data.visited_at + "分,我在" +that.data.garden + '呼叫了上门回收,你也一起吧...!'
    let title = that.data.start_time + "分,我在" +that.data.address_detail + '参加了垃圾分类活动,你也一起吧...!'

    if (res.from === 'button') {
      return {
        title: title,
        path: "/pages/garbageClass/index",
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