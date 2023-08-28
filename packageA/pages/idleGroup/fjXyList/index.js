const app = getApp();
const common = require('../../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataStatus:false,
    fjxyList:[],  // 团组
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
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
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      fjxyList:[],  // 团组
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    that.getData();
  },
  getData() { //初始化数据
    let that = this;
    that.getFjxyList();
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
     // 附近闲友
     getFjxyList(){
      let that = this;
      common.get('/idlegroup/near_member',{
        lat: that.data.latitude,
        lng: that.data.longitude
      }).then(res =>{
        if(res.data.code == 200){
          let fjxyList = res.data.data;
          that.setData({
            fjxyList,
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
    // 点击闲友头像
    gotoxyIdle(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/mine/myIdle_baby/index?member_id=' + id,
      });
    },
})