const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    inte_number:0
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
  get_inte(e){
    console.log(e)
    let that = this;
    let money = e.detail.value;
    let inte_number = that.data.inte_number;
    common.get('/ad/buy_i',{
      member_id: wx.getStorageSync('member_id'),
      i:inte_number,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '兑换成功！',
          icon:'none',
          duration: 2000
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '/packageA/pages/merchant_entrance/index',
          })
        },2000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  set_money(e){
    console.log(e)
    let that = this;
    let money = e.detail.value;
    that.setData({
      inte_number: Number(money*10).toFixed(2),
    })
  }
})