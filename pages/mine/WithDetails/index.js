const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_price:0,
    list:[],
    lists:[],
    pageIndex: 1,
    pageSize: 20,
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetails();
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

  getDetails() {
    let that = this;
    wx.showLoading({
      title: '正在查询...'
    })
    common.get("/memberinfo/withdrawal", {
      member_id : wx.getStorageSync('member_id'),
    }).then(res => {
      wx.hideLoading();
      console.log(res.data.data)
      that.setData({
        total_price: res.data.data.sum,
      });
      let data =  res.data.data.result.reverse();// 获取存储总数据
      let pageSize = that.data.pageSize;// 获取每页个数
      that.setData({
        count: data.length,
      })
      if(data.length > 0){
        for (let i = 0; i < data.length; i += pageSize){
          // 分割总数据，每个子数组里包含个数为pageSize
          that.data.list.push(data.slice(i, i + pageSize))
        }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */

  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      pageIndex: 1,
      hasMore: true,
      list:[],
      lists: [],
    })
    that.getDetails();
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
      that.getlistData();
      wx.hideLoading()
    }, 1000)
  },
  turnto() {
    let pageslist = getCurrentPages();
    console.log(pageslist.length);
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/pages/usecoin/usecoin" });
    }
  },
})