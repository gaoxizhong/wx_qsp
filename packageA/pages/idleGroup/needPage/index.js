// packageA/pages/idleGroup/needPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_tab: '1',
    is_idle: '',
    id: '',
    business_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      is_idle: options.is_idle,
      id: options.id,
      business_id: options.business_id
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
  clicktab(e){
    this.setData({
      is_tab: e.currentTarget.dataset.is_tab,
      
    })
  },
  clickbtn(){
    let that = this;
    let is_tab = that.data.is_tab;
    if( is_tab == '1' ){
      // 面对面交易
      wx.navigateTo({
        url: "/packageA/pages/onlineTrading/index"
      })
    }
    if(is_tab == '2'){
      // 线上交易
      wx.navigateTo({
        url: "/pages/tobuy_welfare/tobuy_welfare?is_idle=" + that.data.is_idle + "&id=" + that.data.id + "&business_id=" + that.data.business_id
      })
    }
  }
})