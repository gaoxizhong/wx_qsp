const common = require("../../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterText:"筛选",
    tab: '',
    hasMore: true,
    pageNo: 1,
    pageSize: 20,
    lists: [], // 收入列表
    detailsLists:[], // 提现明细
    total_price: 0.00,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      tab: options.tab
    })
    if(options.tab == '1'){
      // 收入明细
      that.getConcernMe();
    }
    if(options.tab == '2'){
      // 提现明细
      that.getDetails();
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

  onPullDownRefresh() { //下拉刷新
    let that = this
    that.setData({
      pageNo: 1,
      lists:[],
      hasMore: true,
      detailsLists:[], // 提现明细
    })
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    var tab = that.data.tab;
    if (tab == '1') {
      // 收入明细
      that.getConcernMe();
    }else if(tab == '2'){
       //提现明细
       that.getDetails();
    }
  },
  // 触底函数
  onReachBottom() {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
      success() {
        that.setData({
          pageNo: (that.data.pageNo + 1)
        })
        var tab = that.data.tab;
        if (tab == '1') {
          // 收入明细
          that.getConcernMe();
        }else if(tab == '2'){
           //提现明细

        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 点击标题切换当前页时改变样式
  swichNav(e) {
    let that = this;
    that.setData({
      detailsLists: [], // 提现列表
      list:[], // 收入列表
      pageNo: 1,
      hasMore: true,
    })
    var tab = e.currentTarget.dataset.current;
    that.setData({
      tab,
    })
    if (tab == '1') {
      // 收入明细
      that.getConcernMe();
    }else if(tab == '2'){
       //提现明细
       that.getDetails();
    }
  },
  // 收入明细
  getConcernMe() {
    let that = this;
      wx.showLoading({
        title: '正在查询...'
      })
      if (!that.data.hasMore){
        wx.showToast({
          title: '已加载全部...',
          icon:'none'
        })
        return
      }
    common.get("/memberinfo/getWallet", {
      member_id: wx.getStorageSync('member_id'),
      page: that.data.pageNo
    }).then(res => {
      wx.hideLoading();
        var newList = that.data.lists.concat(res.data.result_shop);
      // 2.3 获取数据的总数
      var count = res.data.total;
      // 2.4 用于判断比较是否还有更多数据
      var flag = that.data.pageNo * that.data.pageSize < count;
        that.setData({
          hasMore: flag,
          lists: newList,
          total_price: res.data.total_price,
        });
    })
  },
  // 提现明细
  getDetails() {
    let that = this;
    wx.showLoading({
      title: '正在查询...'
    })
    common.get("/memberinfo/withdrawal", {
      member_id : wx.getStorageSync('member_id'),
      page : that.data.pageNo
    }).then(res => {
      wx.hideLoading();
      console.log(res.data.data)
      that.setData({
        detailsLists: res.data.data.result.reverse(),
        total_price: res.data.data.sum,
      });
    })
  },
})