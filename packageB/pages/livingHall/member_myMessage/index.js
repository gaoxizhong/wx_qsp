const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOrderList: true,  //展示订单
    start_time:'',
    end_time:'',
    pageNo: 1,
    pageSize: 20,
    orderList: [],
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
    let that = this;
    that.setData({
      member_id : wx.getStorageSync('member_id'),
    })
    that.getLikeList();
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
  //切换筛选状态
  changeCheck() {
    if ( this.data.showOrderList ) {
      this.setData({
        showOrderList: false
      })
    } else {
      this.setData({
        showOrderList: true
      })
    }
  },
    // 列表
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
            orderList: res.data.data.comment
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
    }
})