const common = require("../../../../assets/js/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucher:[], // 优惠券列表
    commodityList: [], // 可兑换商品列表
    space:{},
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
    that.getmy_space();
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
  // 查看全部优惠券
  gotoList(){
    wx.navigateTo({
      url: '/packageB/pages/livingHall/member_platformGift/index',
    })
  },
     //查看我的信息
  getmy_space(){
    let that = this;
    common.get('/life/index?op=my_space',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        let voucher = res.data.data.voucher;
        let space = res.data.data.space;
        that.setData({
          voucher,
          space,
        })
      }else{

      }
    }).catch( e =>{
      console.log(e)
    })
  },
})