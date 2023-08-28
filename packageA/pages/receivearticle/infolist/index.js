const app = getApp()
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getdatalist:[],
    tel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    common.get('/collect_clothes/phone').then(res =>{
      if(res.data.code == 200){
        that.setData({
          tel : res.data.data
        })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getdatalist()
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
  getdatalist(){
    let that = this;
    common.get('/collect_clothes/index',{
      member_id:wx.getStorageSync('member_id'),
    }).then( res =>{
      if(res.data.code == 200){
        that.setData({
          getdatalist:res.data.data
        })
      }
    })
  },
  gotodetails(e){
    let that = this;
    console.log(e)
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/receivearticle/details/index?id=' + id,
    })
  },
  addlistdata(){
    wx.navigateTo({
      url: '/packageA/pages/receivearticle/formsubmiss/index',
    })
  },
  gotoaddress(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageA/pages/receivearticle/address_info/index?id='+id,
    })
  },
  /**调用电话 */
  tel() {
    if (this.data.tel != null){
      wx.makePhoneCall({
        phoneNumber: this.data.tel,
      })
    }else{
      app.showToast({
        title: "暂无联系电话"
      })
    }
  },
})