const app = getApp();
const common = require('../../../assets/js/common');
const zhuan_dingwei = require('../../../assets/js/dingwei.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter_list:[],
    total_peop:0,
    longitude:'',
    latitude:'',
    pageIndex:1,
    pageSize:15,
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.onPullDownRefresh();

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
    let that = this;
    that.setData({
      filter_list:[],
      pageIndex:1,
      hasMore:true
    })
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        wx.setStorageSync('zhuan_dingwei', gcj02tobd09);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        that.getFilterlist();
      },
      fail: function(res) {
        wx.showModal({
          title: '需要开启手机定位',
          content: '请前去开启GPS服务',
          showCancel:false,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
        that.getFilterlist();
      }
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      pageIndex: (that.data.pageIndex + 1)
    })
    that.getFilterlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getFilterlist(){
    const that = this;
    let page = that.data.pageIndex;
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
    })
    common.get("/content_personal/personal_integral_market_index",{
      lng:that.data.longitude,
      lat: that.data.latitude,
      member_id: wx.getStorageSync('member_id'),
      page,
    }).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        let pageSize = that.data.pageSize;// 获取每页个数
        let count = res.data.data.count;// 获取数据的总数
        let flag = that.data.pageIndex * pageSize < count;
        that.setData({
          // 将新获取的数据拼接到之前的数组中
          filter_list: that.data.filter_list.concat(res.data.data.result),
          hasMore: flag,
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
  gotobuypages(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let integral = e.currentTarget.dataset.integral;
    let member_id = e.currentTarget.dataset.member_id;
    let price = e.currentTarget.dataset.price;
    wx.navigateTo({
      url: '/packageA/pages/geren_buypages/index?member_id=' + member_id + '&id=' + id + '&integral=' + integral + '&price=' + price,
    })
  }
})