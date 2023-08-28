const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work_list:[], // 作品推荐
    pageIndex:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    that.getworkList();
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
    let that = this;
    that.setData({
      work_list:[],
      pageSize:1
    })
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    that.getworkList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    wx.showLoading({
      title: "加载中...",
      icon: 'none',
      mark: true,
      success() {
        that.setData({
          pageIndex: (that.data.pageIndex + 1)
        })
        that.getworkList();
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getworkList(){
    let that = this;
    common.get('/life/index?op=work_list',{
      is_sale: 1, //0全部 1售卖 2展示
      page: that.data.pageIndex,
      page_size: 8
    }).then(res =>{
      if(res.data.code == 200){
        let newwork_list = that.data.work_list.concat(res.data.data.work_list);
        that.setData({
          work_list: newwork_list,
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
  clickBuy(e){
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      // url: '/packageB/pages/livingHall/reserve_buypages/index?id=' + id,
      url: '/packageB/pages/livingHall/goodsDetails/index?id=' + id,
    })
  },
})