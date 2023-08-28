const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiple:'',
    selected:1,
    multiple: 10
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
      multiple: e.currentTarget.dataset.multiple
    })
  },
  recharge_btn(){
    let that = this;
    let multiple = that.data.multiple;
    let selected = that.data.selected;
    if(!selected || selected == 0){
      wx.showToast({
        title: '请选择要提升倍数',
        icon:'none'
      })
      return
    }
    common.get('/ad/change',{
      member_id:wx.getStorageSync('member_id'),
      multiple,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '提升成功！',
          icon:'none',
          duration: 2000
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '/packageA/pages/merchant_entrance/index',
          })
        },2000)
      }else{
        wx.showToast({
          title: res.data.mag,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },

})