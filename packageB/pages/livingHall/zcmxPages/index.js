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
    like_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取点赞信息
    this.getCodeSession();
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
  },
  // 获取点赞信息
  getCodeSession(){
    let that = this;
    common.get('/life/index?op=check_num', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          like_list: res.data.data.coin_use_list
        });
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
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
})