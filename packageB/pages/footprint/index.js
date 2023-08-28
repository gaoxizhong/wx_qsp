const common = require("../../../assets/js/common")
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(options.is_comtype == 'community'){
      wx.setNavigationBarTitle({
        title:'绿城•金泰城丽湾'
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
  goToOrderPage(){
    wx.navigateTo({
      url: '/pages/mine/myOrder/index?status=0&cur=3&is_comtype=community',
    })
  },

  goTofidd(){
    wx.navigateTo({
      url: '/pages/myDicountOrder/myDicountOrder?type=1&status=&is_comtype=community',
    })
  },

  goTohsjl(){
    wx.navigateTo({
      url: 'url',
    })
  }
})