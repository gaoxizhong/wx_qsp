const app = getApp()
const common = require('../../../assets/js/common');
var zhuan_dingwei = require('../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon_list:[],
    b_coupon:0,
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
    that.getmycouponlist();
  },
  // 获取优惠券列表
  getmycouponlist(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/coupon/my_coupon',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.dcode = 200){
        wx.hideLoading();
        that.setData({
          coupon_list:res.data.data,
          b_coupon:res.data.aaa
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none',
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
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
  //前往活动详情
  goToActivity(e) {
    console.log(e)
    let that = this;
    let id = e.detail.id;
    let order_number = e.detail.order_number;
    let stock = e.detail.stock;
    let url = "/packageA/pages/coupon_detail/index?order_id=" + id + "&order_number=" + order_number + "&stock=" + stock;
    wx.navigateTo({
      url: url
    })
  },
})