const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    space_list:[],
    pageIndex:1,
    v_back:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    that.getspaceList();
    this.imageerror();

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
    this.setData({
      member_id: wx.getStorageSync('member_id')
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
      workList:[],
      pageSize:1
    })
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    that.getspaceList();
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
      success() {
        that.setData({
          pageIndex: (that.data.pageIndex + 1)
        })
        that.getspaceList();
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
  getspaceList(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=space_list',{
      is_vip:'1',
      member_id: wx.getStorageSync('member_id'),
      page: that.data.pageIndex,
      page_size: 5,
      is_sale: 0,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let newspaceList = that.data.space_list.concat(res.data.data.space_list);
        that.setData({
          space_list: newspaceList,
        })
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
  // 跳转个人主页
  gotoPersonalHome(e){
    let mid = e.currentTarget.dataset.member_id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/personal_home/index?mid=' + mid,
    })
  },
  clickBuy(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      // url: '/packageB/pages/livingHall/reserve_buypages/index?id=' + id,
      url: '/packageB/pages/livingHall/goodsDetails/index?id=' + id,
    })
  },
  imageerror(e){
    console.log(e)
    this.setData({
      v_back: 'https://oss.qingshanpai.com/banner/shopbg-error.png'
    })
  },
})