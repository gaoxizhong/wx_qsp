const common = require("../../../../assets/js/common");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_likeList:[]
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
    this.getLikeList();
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
  // 点赞列表
  getLikeList(){
    let that = this;
    wx.showLoading({
      title:'加载中...'
    })
    common.get("/life/index?op=my_like",{
      member_id: wx.getStorageSync('member_id')
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        that.setData({
          my_likeList: res.data.data.like
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  gotogoodsdetails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/goodsDetails/index?id=' + id,
    })
    
  }
})