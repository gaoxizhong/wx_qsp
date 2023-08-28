const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellRankTab:0,
    sellBuddyRankList:[{},{}], // 好友排行
    sellNearbyRankList:[{},{}], // 附近排行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
    // 点击排行榜切换当前页时改变样式
    sellRankNav: function (e) {
      let that = this
      var cur = e.currentTarget.dataset.sellrank;
      if (cur == 1) {
        //附近排行
  
      } else if (cur == 0) {
        //好友排行
  
      }
      that.setData({
        sellRankTab: cur
      })
    },
})