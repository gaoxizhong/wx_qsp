const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    selected:0
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
  select_items(e){
    console.log(e)
    this.setData({
      selected: e.currentTarget.dataset.id,
      money: e.currentTarget.dataset.sel_money
    })
  },
  setinput(e){
    console.log(e)
    let that = this;
    let money = e.detail.value;
    that.setData({
      selected:0,
    })
    if(money >= 5999){
      that.setData({
        money: 5999
      })
      retu1rn
    }else{
      that.setData({
        money,
      })
    }
  },
  recharge_btn(){
    let that = this;
    publicMethod.recharge_btn(that,that.goTOreLaunch);
  },
  makeCall() {
    wx.makePhoneCall({
      phoneNumber: "010-84672332"
    })
  },
  goTOreLaunch(){
    wx.reLaunch({
      url: '/packageA/pages/merchant_entrance/index',
    })
  }
})