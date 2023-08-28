// packageA/pages/onlineTrading/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    welfare:{},
    location:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       
    this.setData({
      member_id: wx.getStorageSync('member_id'),
      welfare: wx.getStorageSync("toBuyWel"),
    })
    let location_1 = wx.getStorageSync("toBuyWel").activityInfo.location;
    let location = location_1 ? JSON.parse(location_1) : null;
    console.log(location)
    this.setData({
      location,
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
  /**调用电话 */
  tel(e) {
    console.log(e)
    if (e.currentTarget.dataset.phonenumber != null) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phonenumber,
      })
    } else {
      wx.showToast({
        title: "暂无联系电话",
        icon:'none'
      })
    }
  },
  getRoadLine(){
    let that = this;
    let location = that.data.location;
    if(!location){
      wx.showToast({
        title: '暂无导航！',
        icon: 'none'
      })
      return
    }else{
      wx.getLocation({
        type: 'gcj02', //'gcj02'返回可以用于wx.openLocation的经纬度
        isHighAccuracy: true,
        success: function (res) {  //因为这里得到的是你当前位置的经纬度
          const latitude = Number(that.data.location.lat)
          const longitude = Number(that.data.location.lng)
          console.log(res)
          wx.openLocation({
            latitude,
            longitude,
            name: '',
            address: that.data.welfare.activityInfo.discount_address,
            scale: 18
          })
        }
      })
    }

  }
})