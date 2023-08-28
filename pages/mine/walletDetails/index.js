const common = require('../../../assets/js/common');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'1', // 订单状态 0 待支付、1已付款、2已完成、10已取消
    express_status:'', // 物流状态 0 未发货 1已发货 2 已到货
    dealType:'sell',  //  订单类型 buy: 我买的 sell: 我卖的
    beusedList:[],
    pageIndex: 1,
    pageSize: 20,
    hasMore: true,
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    wx.setNavigationBarTitle({
      title:'出售记录'
    })
    that.getbeusedList();
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
  onPullDownRefresh() { //下拉刷新
    let that = this;
    that.setData({
      pageIndex: 1,
      hasMore: true,
      list:[],
      beusedList: [],
    })
    that.getbeusedList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getbeusedList(){
    let that = this;
    let p = {
      status: that.data.status,
      work_member_id: wx.getStorageSync('member_id')
    };
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=order_list',p).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let data = res.data.data.list;// 获取存储总数据
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
    }).catch(e =>{
      wx.hideLoading();
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
      beusedList: that.data.beusedList.concat(list[page]),
      hasMore: flag,
    })
  },
  goTogoodsDetails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/goodsDetails/index?id=' + id,
    })
  },
  // 点击去发货按钮
  shipmentsOrder(e){
    let that = this;
    let order_id = e.currentTarget.dataset.id;
    let work_id = e.currentTarget.dataset.work_id;

    wx.showModal({
      content: '确定该订单已发货吗？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/packageB/pages/livingHall/logistics/index?order_id=' + order_id + '&work_id=' + work_id,
          })
        }
      }
    })
  },
  // 查看物流
  viewLogistics(e){
    console.log(e)
    let that = this;
    let order_id = e.currentTarget.dataset.id;
    let url = "/packageB/pages/livingHall/viewLogistics/index?order_id=" + order_id;
    wx.navigateTo({
      url: url,
    })

  },
  // 点击确认收货
  clickShou(e){
    let that = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确定收货吗？',
      success: function (res) {
        if (res.confirm) {
          common.get("/life/index?op=order_done", {
            member_id: wx.getStorageSync('member_id'),
            order_id,
          }).then(res => {
            if (res.data.code == 200) {
              wx.showToast({
                title: '确定收货成功！',
                icon: 'success'
              })
              beusedList.splice(index, 1);
              that.setData({
                beusedList
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
          })
        }
      }
    })
  },
  
})