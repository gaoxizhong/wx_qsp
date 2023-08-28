const app = getApp()
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
var WxParse = require('../../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    poster_tabs:[],
    swiper_index:0,
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    canIUseGetUserProfile: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
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
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        pop2: false
      })
    }
    that.getBannerUrls();
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
  moveServerProSwiper(e){
    this.setData({
      swiper_index:e.detail.current,
    })
  },
  getBannerUrls() { //轮播图地址
    let that = this
    common.get('/banner/newInfo', {
      member_id: wx.getStorageSync('member_id'),
      type: 19
    }).then(res => {
      if (res.data.code == 200) {
        var article = res.data.data.text;
        WxParse.wxParse('article', 'html', article, that, 1);
        that.setData({
          poster_tabs: res.data.data.banner,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
    })
  },
  donate_types(){
    wx.navigateTo({
      url: "/pages/publish/publish"
    })
  },
})