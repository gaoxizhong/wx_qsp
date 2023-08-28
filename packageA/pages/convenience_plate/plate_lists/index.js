const app = getApp()
const common = require('../../../../assets/js/common');
const zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    is_publisher:0, // 是否是发布者
    items_list:[],
    id:'',
    longitude:'',
    latitude:'',
    pageIndex:1,
    pageSize:15,
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      id: options.id,
      member_id: wx.getStorageSync('member_id'),
    })
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
    let that = this;

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
      items_list:[],
      pageIndex:1,
      hasMore:true
    })
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(Number(res.longitude),  Number(res.latitude));
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
        that.getitemslist();
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
        that.getitemslist();
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
    that.getitemslist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取项目列表
  getitemslist(){
    let that = this;
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
    common.get('/newservice/index', {
      id: that.data.id,
      member_id: wx.getStorageSync('member_id'),
      lng: that.data.longitude,
      lat: that.data.latitude,
      page,
    }).then(res => {
      if (res.data.code == 200) {
        wx.hideLoading();
        let pageSize = res.data.data.pageSize;// 获取每页个数
        let count = res.data.data.count;// 获取数据的总数
        let flag = that.data.pageIndex * pageSize < count;
        that.setData({
          is_publisher: res.data.data.is_publisher,
          // 将新获取的数据拼接到之前的数组中
          items_list: that.data.items_list.concat( res.data.data.array ),
          hasMore: flag,
        })
        if(that.data.items_list.length <= 0){
          wx.showToast({
            title: '暂无数据',
            icon:'none',
            duration:5000
          })
        }
      }else{
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e => {
      wx.hideLoading();
      app.showToast({
        title: "数据异常"
      })
    })
  },
  goToclassactical(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/convenience_plate/plate_details/index?id=' + id,
    })
  },
  gotomy_release(){
    let that = this;
    wx.navigateTo({
      url: '/packageA/pages/convenience_plate/release_service_info/index',
    })
  }
})