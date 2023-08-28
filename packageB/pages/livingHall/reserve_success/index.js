// packageB/pages/livingHall/reserve_success/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_shang:'',
    is_buy:'',
    is_type:'',
    space_list:[],
    pageIndex:1,
  },
  getspaceList(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/life/index?op=space_list',{
      is_vip:'1',
      member_id: wx.getStorageSync('member_id'),
      page: that.data.pageIndex,
      is_sale: 0,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let newspaceList = that.data.space_list.concat(res.data.data.space_list);
        that.setData({
          space_list: newspaceList,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      member_id: wx.getStorageSync('member_id')
    })
    if(options.is_type){
      this.setData({
        is_type: options.is_type
      })
    }
    if(options.is_buy){
      this.setData({
        is_buy: options.is_buy
      })
    }
    if(options.is_shang){
      this.setData({
        is_shang: options.is_shang
      })
    }
    that.getspaceList();
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
    this.setData({
      member_id: wx.getStorageSync('member_id')
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
    let that = this;
    that.setData({
      workList:[],
      pageSize:1
    })
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    that.getspaceList();
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
        that.getspaceList();
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
  gotoHome(){
    wx.reLaunch({
      url: '/packageB/pages/livingHall/livingHall_home/index',
    })
  },
  gotoPersonalHome(e){
    let mid = e.currentTarget.dataset.member_id;
    wx.navigateTo({
      url: '/packageB/pages/livingHall/personal_home/index?mid=' + mid,
    })
  },
})