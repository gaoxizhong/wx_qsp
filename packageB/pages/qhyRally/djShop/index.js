const common = require("../../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[],
    community_info_id:'', // 社区id
    community_market_id:'', //社区大集ID\
    marketInfo:{}, // 大集信息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    wx.setNavigationBarTitle({
      title:'清河营中路低碳社区'
    })
    var marketInfo = JSON.parse(options.marketInfo);
    that.setData({
      marketInfo
    })
    console.log(that.data.marketInfo)
    setTimeout(() =>{
      that.getShopByCate();
    },100)
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
    //从商家列表跳转到商家
    goToShop(e) {
      let businessid =  e.currentTarget.dataset.id;
      let url = "/pages/shop/shop?business_id=" + businessid;
      wx.navigateTo({
        url: url
      })
  
    },
    getShopByCate() {
      let that = this;
      let p ={
        community_info_id: that.data.marketInfo.community_info_id,
        community_market_id: that.data.marketInfo.id,
      }
      wx.showLoading({
        title:'加载中...'
      })
      common.get('/community_market/community_market_business', p).then( res => {
        wx.hideLoading();
        if ( res.data.code == 200 ) {
          let sortList = that.data.shopList.concat(res.data.data);
          if ( that.data.shopList_page > 1 &&  res.data.data.length == 0) {
            wx.showToast({
              title: '已加载全部...',
              icon: 'none',
              duration: 1000
            })
          }
          that.setData({
            shopList: sortList
          })
        } else if ( res.data.code == 206 ) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }).catch( error => {
        wx.hideLoading();
        console.log(error);
      })
    },
})