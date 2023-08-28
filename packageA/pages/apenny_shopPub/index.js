const common = require("../../../assets/js/common");

// packageA/pages/dynamic_drainage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_type_moving: 0,
    sele_info_moving:'',
    is_bullet:false,
    yulian_info:{}
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
    let that = this;
    let sele_info_moving = wx.getStorageSync('apenny_info_ad');
    let select_type_moving = wx.getStorageSync('apenny_type_ad');
    console.log(select_type_moving)
    that.setData({
      sele_info_moving,
      select_type_moving
    })
    console.log(that.data.sele_info_moving)
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
  gotosele(){
    wx.navigateTo({
      url: '/packageA/pages/tool_choosepages/index?is_apenny=1',
    })
  },
  goRedstyle(){
    let select_type_moving = this.data.select_type_moving;
    if(!select_type_moving){
      wx.showToast({
        title: '请先选择要推广的商品/优惠券',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageA/pages/apenny_activity_schedule/index',
    })
  },




})