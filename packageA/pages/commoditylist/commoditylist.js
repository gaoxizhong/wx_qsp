const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if(options.member_id){
      that.setData({
        member_id: options.member_id,
      })
    }
    if(options.lat){
      that.setData({
        lat:options.lat,
        lng: options.lng,
      })
    }
    that.gettuan_goods_list();
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
  // 获取商品列表
  gettuan_goods_list() {
    let that = this;
    let member_id = that.data.member_id;
    let lat = that.data.lat;
    let lng = that.data.lng;
    let perm = {
      member_id,
      lat,
      lng,
    }
    common.get('/service/tuan_goods_list', perm).then(res => {
      if (res.data.code == 200) {
        var listData = res.data.data;
        that.setData({
          listData,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
      }
    })
  },
  goToActivity(e) {
    console.log(e)
    let that = this;
    let member_id = that.data.member_id;
    let business_id = e.currentTarget.dataset.business_id;
    let discount_id = e.currentTarget.dataset.discount_id;
    let is_tuan = e.currentTarget.dataset.is_tuan;
    let url = "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + member_id + "&discount_id=" + discount_id + '&is_tuan=' + is_tuan;
    wx.navigateTo({
      url: url
    })
  },
})