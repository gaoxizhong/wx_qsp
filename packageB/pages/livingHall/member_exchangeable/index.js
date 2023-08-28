const common = require("../../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_illustrate: false,
    today_count:0,  // 今日赞数
    yestoday_count:0,  // 昨日赞数
    my_coin:0, // 我的余额
    coin_share:0, // 作品分享收益
    coin_like:0, // 获赞收益历史记录
    today_exchange_coin: {}, // 今日兑换的
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
  // 收入明细
  goto_s_etails(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/member_incomeBreakdown/index',
    })
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
    // 获取点赞信息
    getCodeSession(){
      let that = this;
      common.get('/life/index?op=check_num', {
        member_id: wx.getStorageSync('member_id'),
      }).then(res => {
        if (res.data.code == 200) {
          that.setData({
            yestoday_count: res.data.data.yestoday_count, // 昨日赞数
            today_count: res.data.data.today_count, // 今日赞数
            my_coin:res.data.data.my_coin.toFixed(2), // 我的余额
            coin_share: Number(res.data.data.coin_share).toFixed(2), // 作品分享收益
            coin_like: Number(res.data.data.coin_like).toFixed(2), // 获赞收益历史记录
            today_exchange_coin:res.data.data.today_exchange_coin?res.data.data.today_exchange_coin:{},
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
    // 跳转收入明细
    goToExchangeRecord(){
      wx.navigateTo({
        // url: '/packageB/pages/livingHall/Like_exchangeRecord/index',
        url: '/packageB/pages/livingHall/kyyesrmx/index',
      })
    },
    goTozcmx(){
      wx.navigateTo({
        url: '/packageB/pages/livingHall/zcmxPages/index',
      })
    }
})