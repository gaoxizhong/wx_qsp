const app = getApp();
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wenzData:[],
    showFull: [],
    swiper_shop:false,
    top_img:[],
    circle_page: 1, //当前展示页数
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        that.setData({
          longitude: Number(res.longitude),
          latitude: Number(res.latitude),
        })
        that.getData();
      },
      fail: function(res) {
        console.log('未获取到定位')
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getData();
      }
    })

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
  getData() { //初始化数据
    let that = this;
    that.getCircleItems();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('下拉刷新');
    let that = this;
    that.setData({
      showFull: [],
      wenzData: [],
      circle_page: 1,
    })
    that.getData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('触底函数')
    let that = this;
    wx.showLoading({
      title:"加载中...",
      icon:'none',
      mark:true,
      success(){
        that.setData({
          circle_page: (that.data.circle_page + 1)
        })
        that.getData();
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

  // 获取列表信息
  getCircleItems() {
    let that = this;
    common.get("/olympic/index?op=content_list", {
      member_id: wx.getStorageSync('member_id'),
      page: that.data.circle_page,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    }).then(res => {
      if (res.data.code == 200) {
        let wenzData = that.data.wenzData.concat(res.data.data.site);
        that.setData({
          wenzData: wenzData,
        })
        for (var i = 0; i < wenzData.length; i++) {
          let obj = {};
          obj.leng = wenzData[i].content.length;
          obj.status = false;
          that.data.showFull.push(obj);
        }
        that.setData({
          showFull,
        })
        wx.stopPullDownRefresh();
      }
    })
  },
  previewImage1(e) {
    console.log(e)
    let that = this;
    let swiper_index = e.currentTarget.dataset.subidx;
    that.setData({
      top_img:e.currentTarget.dataset.images,
      swiper_index,
      swiper_shop:true
    })
  },
close_swiper(){
    let that = this;
    that.setData({
      top_img:[],
      swiper_shop:false
    })
  },
  openFulltxt(e) { //打开全文
    publicMethod.openFulltxt(e, this)
  },
  turnto() {
    let pageslist = getCurrentPages();
    if (pageslist && pageslist.length > 1) {
      wx.navigateBack({ delta: -1 });
    } else {
      wx.reLaunch({ url: "/packageB/pages/winter_olympics/winter_punchlist/index" });
    }
  },
  
})