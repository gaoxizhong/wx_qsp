const app = getApp();
const common = require('../../assets/js/common');
const setting = require('../../assets/js/setting');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }]
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSalesPact();
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

  // 获取内容协议
  getSalesPact(){
    wx.showLoading({
      title: '加载中...',
      duration: 1000
    })
    let that = this
    common.get("/sale/protocol").then(res =>{
      var article = res.data
      WxParse.wxParse('article', 'html', article, that, 1);
    })
  },
  // 点击返回
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/index/index" });
    }
  },
})