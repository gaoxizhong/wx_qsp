const app = getApp();
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lottery_result:[],
    member_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id')
    })
    // 禁止右上角转发
    wx.hideShareMenu();
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
    this.getlottery_result();
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
  getlottery_result(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/lottery/lottery_result',{
    member_id:wx.getStorageSync('member_id'),
  }).then(res =>{
    if(res.data.code == 200){
      wx.hideLoading();
      that.setData({
        lottery_result: res.data.list
      })
    }else{
      wx.hideLoading();
      wx.showToast({
        title: res.data.msg,
        icon: 'none'
      })
    }
  }).catch(e =>{
    wx.hideLoading();
    console.log(e)
  })
},
gotoyaoqing(e){
  let that = this;
  console.log(e)
  let red_id = e.currentTarget.dataset.red_id;
  wx.navigateTo({
    url: '/packageA/pages/lottery_project/lottery_detail/index?red_id=' + red_id,
  })
}
})