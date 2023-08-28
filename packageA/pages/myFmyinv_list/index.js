const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extInfoList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getextInfoList();
  },
  // 获取我的不同志愿列表
  getextInfoList(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/fmy/inv_list',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.dcode = 200){
        wx.hideLoading();
        that.setData({
          extInfoList:res.data.data.ext,
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
  gotodetail(e){
    console.log(e)
    let invext_id = e.currentTarget.dataset.invext_id;
    wx.navigateTo({
      url: '/packageA/pages/invext_activity/index?invext_id=' + invext_id + '&status=0',
    })
  }
})