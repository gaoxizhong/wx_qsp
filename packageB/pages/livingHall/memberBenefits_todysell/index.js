const common = require("../../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_illustrate: false,
    money: 0,
    today_sale: 0, // 今日卖出
    today_money: 0,
    projectID:null

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
    this.setData({
      projectID: this.selectComponent("#projectID")
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 可提现金额
    this.tx_jine();
    // 获取点赞信息
    this.getCodeSession();
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
    let that = this;
    that.data.projectID.getprojectList();
    setTimeout(function(){
    wx.stopPullDownRefresh()
    },1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  openIllustrate(){
    this.setData({
      is_illustrate:true
    })
  },
  infoTextBtn(){
    this.setData({
      is_illustrate:false
    })
  },
    // 可提现金额
    tx_jine() {
      let that = this;
      common.get('/memberinfo/indexWithdraw', {
        member_id: wx.getStorageSync('member_id'),
      }).then(res => {
        console.log(res)
        that.setData({
          money: Number(res.data.data.balance),
          done_p: res.data.data.done,
          refuse_p: res.data.data.refuse,
        })
      }).catch(e => {
        app.showToast({
          title: "错误",
        })
        console.log(e)
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
          today_sale: res.data.data.today_sale, // 今日卖出
          today_money: res.data.data.today_money, // 今日收益
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

  gotoTx(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/member_withdrawPage/index',
    })
  },
  goToLikeGetDetails(){
    let that = this;
    let menber_id = wx.getStorageSync('member_id');
    let url = "/pages/mine/walletDetails/index?member_id=" + menber_id;
    wx.navigateTo({
      url,
    })
  },
    //跳转到提现明细页面
    getWithdraw() {
      let that = this;
      let menber_id = wx.getStorageSync('member_id');
      let url = "/pages/mine/WithDetails/index?member_id=" + menber_id;
      wx.navigateTo({
        url,
      })
    },
    goTogd(){
      wx.navigateTo({
        url: '/packageB/pages/livingHall/personal_home/index?is_more=1&is_share=3&mid=' + wx.getStorageSync('member_id'),
      })
    }
})