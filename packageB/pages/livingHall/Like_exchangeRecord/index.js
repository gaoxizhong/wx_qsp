const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOrderList: true,  //展示订单
    start_time:'',
    end_time:'',
    pageIndex: 1,
    pageSize: 20,
    hasMore: true,
    list:[],
    orderList: [],
    is_source: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      is_source: options.is_source
    })
    this.getCodeSession();
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
    that.setData({
      member_id : wx.getStorageSync('member_id'),
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
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      pageIndex: 1,
      hasMore: true,
      list:[],
      orderList: [],
    })
    that.getCodeSession();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //切换筛选状态
  changeCheck() {
    if ( this.data.showOrderList ) {
      this.setData({
        showOrderList: false
      })
    } else {
      this.setData({
        showOrderList: true
      })
    }
  },
  getCodeSession(){
    let that = this;
    common.get('/life/index?op=check_num', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        let list = res.data.data.coin_log;
        let is_source = that.data.is_source;
        let orderList = [];
        list.forEach(ele => {
          if(ele.source == is_source){
            orderList.push(ele)
          }
        });
        let data = orderList;// 获取存储总数据
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
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
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
      orderList: that.data.orderList.concat(list[page]),
      hasMore: flag,
    })
  },



})