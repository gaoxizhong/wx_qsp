const common = require("../../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_illustrate: false,
    yestoday_count:0,  // 昨日赞数
    my_coin:0, // 我的余额--可用余额
    today_exchange_coin_share: {}, // 今日兑换的
    no_exchange_sale: 0, // 分享付款人（单）
    share_scale:'', // 分享转换比例
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
  catchtouchmove(){
    return false
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
  goToExchangeRecord(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/Like_exchangeRecord/index?is_source=2',
    })
  },
  goToLikeGetDetails(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/fxmx/index',
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
          my_coin:res.data.data.my_coin.toFixed(2), // 我的余额
          no_exchange_sale: res.data.data.no_exchange_sale, // 分享付款人
          share_scale: res.data.data.share_scale +'%'
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
  // 转换积分
  conversion_btn(){
    let that = this;
    wx.showLoading({
      title:'转换中...'
    })
    common.get("/life/index?op=exchange_coin",{
      member_id:wx.getStorageSync('member_id'),
      source:"2"
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration:1500,
        })
        that.getCodeSession();
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
  goTogd(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/personal_home/index?is_more=1&is_share=3&mid=' + wx.getStorageSync('member_id'),
    })
  }

})