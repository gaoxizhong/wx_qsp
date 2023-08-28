const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    circle_page:1,
    pageSize:10,
    dataStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if (options.member_id) {
      that.setData({
        member_id: options.member_id,
        hasMore:true
      })
    }
    wx.hideShareMenu();
    that.getData();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    publicMethod.zhuan_baidu(this)
    that.setData({
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      personalInfo: wx.getStorageSync('personalInfo'),
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
  getData() {
    let that = this;
    that.getBrowse();
  },
  onPullDownRefresh() { //下拉刷新
    let that = this
    that.setData({
      circle_page: 0,
      showFull: [],
      loadend: []
    })
    that.getBrowse()
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  // 触底函数
  onReachBottom() {
    let that = this;
    wx.showToast({
      title: "到底了...",
      icon: 'none',
      mark: true,
      success() {
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  // 浏览记录列表
  getBrowse() {
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    wx.showLoading({
      title: '加载中...',
    })
    // if (!this.data.hasMore){
    //   wx.showToast({
    //     title: '已加载全部...',
    //     icon:'none'
    //   })
    //   return
    // }
    common.get('/memberinfo/Browsing', {
      member_id
    })
      .then(res => {
        wx.hideLoading()
        console.log(res);
        var listData = res.data.list;
        if (listData.length <= 0) {
          setTimeout(function () {
            that.setData({
              dataStatus: true
            })
          }, 500)
        }
        that.setData({
          listData: listData
        })
      }).catch(e => {
        app.showToast({
          title: "数据异常",
        })
        console.log(e)
      })
  },
  // 前往详情页
  goToActivity(e) {
    let that = this;
    let idle_id = e.currentTarget.dataset.idle;
    let member_id = that.data.member_id;
    let busnesid = e.currentTarget.dataset.busnesid;
    let content_id = e.currentTarget.dataset.content_id;
    let copy_business = e.currentTarget.dataset.copy_business;
    let url = "/pages/mine/myIdle_good/index?member_id=" + member_id + "&idle_id=" + idle_id + "&busnesid=" + busnesid + "&discount_id=" + idle_id + "&copy_business=" + copy_business
    wx.navigateTo({
      url: url
    })
  },

})