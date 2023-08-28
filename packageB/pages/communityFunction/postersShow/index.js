const app = getApp();
const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth : app.data.windowWidth,
    windowHeight : app.data.windowHeight,
    num:0,
    community_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:'绿城•金泰城丽湾'
    })
    this.getClassmodule();
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
      num: Math.random(),
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
  getClassmodule(){
    let that = this;
    common.get('/fmy/index',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200) {
        that.setData({
          community_count: res.data.data.community_count,
          community_people: res.data.data.community_people,
          community_sum: res.data.data.community_sum,
          community_tan: res.data.data.community_tan,

        })
      }else{
        app.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      app.showToast({
        title: "数据异常"
      })
    })
  
  },
})