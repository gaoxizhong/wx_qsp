const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getbuyintegrallist();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getbuyintegrallist(){
    let that = this;
    common.get('/content/getMemberInfo',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          business_info:res.data.business_info,
        })
      }
    }).catch( e =>{
      console.log(e)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() { //分享
  },
  // 跳转授权开店
  gotoAuthorizeShare(){
    wx.navigateTo({
      url: '/packageB/pages/authorize_share/index',
    })
    // wx.navigateTo({
    //     url: '/packageB/pages/authorizeShare_page/index',
    //   })
  },
  // 转账金额
  gotoTransferAmount(){
    wx.navigateTo({
      url: '/packageB/pages/transfer_amount/index',
    })
  },
  // 转账积分
  gotoTransferIntegral(){
    wx.navigateTo({
      url: '/packageB/pages/transfer_integral/index',
    })
  },
  goToBranchState(){
    // wx.showToast({
    //   title: '暂未开通！',
    //   icon:'none'
    // })
    wx.navigateTo({
      url: '/packageB/pages/branch_state/index',
    })
  }
})