const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buyintegral_list:[],
    useinter_info:{},
    is_useinter:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getintegral_list();
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
  getintegral_list(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/agent/ad_integral',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        that.setData({
          buyintegral_list:res.data.data
        })
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e=>{
      wx.hideLoading();
      console.log(e)
    })
  },
  view_usage(){
    let that = this;
    common.get('/agent/ad_usage',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          is_useinter:true,
          useinter_info:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  click_useinter(){
    this.setData({
      is_useinter:false
    })
  }
})