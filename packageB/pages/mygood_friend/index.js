const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists:[],
    list:[],
    pageIndex: 1,
    pageSize: 15,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo,
    })
    that.getConcernMe();

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
  },
  getConcernMe() {
    let that = this;
    common.get("/content/my_friend", {
      member_id: wx.getStorageSync('member_id'),
      page: that.data.pageIndex
    }).then( res => {
      if ( res.data.code == 200 ) {
        let data = res.data.data;// 获取存储总数据
        let pageSize = that.data.pageSize;// 获取每页个数
        for (let i = 0; i < data.length; i += pageSize){
          // 分割总数据，每个子数组里包含个数为pageSize
          that.data.list.push(data.slice(i, i + pageSize))
        }
        that.setData({
          count: data.length,
        })
        that.getlistData();
      }
    })
  },
  getlistData(){ // 前端实现一次获取总数据后分页获取数据
    let that = this;
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
    let page = (that.data.pageIndex - 1);
    let list = that.data.list;
    let count = that.data.count;// 获取数据的总数
    let flag = that.data.pageIndex * that.data.pageSize < count;
    that.setData({
      // 将新获取的数据拼接到之前的数组中
      lists: that.data.lists.concat(list[page]),
      hasMore: flag,
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
    let that = this;
    that.setData({
      list:[],
      lists:[],
      pageIndex: 1,
      hasMore: true,
    })
    that.getConcernMe();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
    })
    setTimeout(function () {
      that.setData({
        pageIndex: (that.data.pageIndex + 1)
      })
      that.getConcernMe();
      wx.hideLoading()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})