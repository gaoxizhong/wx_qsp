const app = getApp();
const common = require('../../assets/js/common');
var date = new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getbooklist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_good_book_list();
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
  get_good_book_list(){
    common.get('/service/get_good_book_list').then(res =>{
      if(res.data.code == 200){
        this.setData({
          getbooklist:res.data.data
        })
      }
    })
  },
      //前往活动详情
      goToActivitylist(e) {
        console.log(e)
        let that = this;
        let member_id = that.data.member_id;
        let id = e.currentTarget.dataset.id;
        let books_id = e.currentTarget.dataset.books_id;
        let url = "/pages/get_good_book/get_good_book?member_id="+ member_id + "&books_id=" + books_id + '&id=' + id;
        wx.navigateTo({
          url: url
        })
      },
})