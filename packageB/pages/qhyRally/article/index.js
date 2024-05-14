// packageB/pages/qhyRally/article/index.js
const common = require('../../../../assets/js/common');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    marketInfo: {},
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var marketInfo = JSON.parse(options.marketInfo);
    this.setData({
      marketInfo,
    })
    console.log(options)
    this.getinfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      shopList: [],
      page: 1
    })
    this.getinfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that = this;
    that.setData({
      page: ( that.data.page + 1 )
    })
    that.getinfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getinfo(){
    let that = this;
    common.get('/article/info',{
      member_id: wx.getStorageSync('member_id'),
      page: that.data.page,
      is_community: 1
    }).then(res =>{
      if(res.data.code == 200){
        let shopList = that.data.shopList.concat(res.data.data.article);;
        that.setData({
          shopList,
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
  gotodetail(e){
    console.log(e)
    wx.navigateTo({
      url: '/packageB/pages/qhyRally/articleDetail/index?article_id=' + e.currentTarget.dataset.article_id,
    })
  }
})