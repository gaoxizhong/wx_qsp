const common = require("../../../../assets/js/common")
const publicMethod = require('../../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    memberBankTitle: '',
    memberIdBank: '',
    realAmount: 0,
    m_name: '',
    m_avatar: '',
    jf: 0,
    t_money: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:'绿城•金泰城丽湾'
    })
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
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      wx.showToast({
        title: '请先登录！',
        icon:'none'
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/login_mark/index',
        })
      },2000)
      return
    }
    this.getaccountnumber();
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
    return {
      title:'低碳社区驿站•金泰城丽湾',
      path:'/packageB/pages/communityFunction/home/index?is_comtype=community'
    }
  },
  // 跳转环保图书馆
  goTobank(){
    wx.navigateTo({
      // url: '/packageA/pages/library/index?library_id=754&is_comtype=community',
      url:'/packageB/pages/communityFunction/toolkit_page/index?is_comtype=community',
    })
  },
  // 跳转环保福利
  goTousecoin(){
    wx.navigateTo({
      url: '/pages/shop/shop?business_id=3255',
    })
  },
  // 跳转旧衣回收
  gotorecyclePlate(){
    wx.navigateTo({
      url: '/packageA/pages/recyclePlate/recyclePlateClothes/index?is_comtype=community',
    })
  },
  goToPostersShow(){
    wx.navigateTo({
      url: '/packageB/pages/communityFunction/postersShow/index?is_comtype=community',
    })
  },
  // 我的优惠券
  goToyhq(){
    wx.navigateTo({
      url: '/packageA/pages/myCouponList/index',
    })
  },
  /**调用电话 */
  tel: function (e) {
    let tel = e.currentTarget.dataset.mobile;
    if (tel != null || tel != '') {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    } else {
      wx.showToast({
        title: "暂无联系电话",
        icon:'none'
      })
    }
  },
  // 获取环保银行账户详情
  getaccountnumber(){
    let that = this;
    common.get("/environmental/bank/environmentalBankHome", {
      member_id: wx.getStorageSync('member_id'),
      type: 8
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          memberBankTitle: res.data.data.memberBankTitle,
          memberIdBank: res.data.data.memberIdBank,
          realAmount: Number(res.data.data.realAmount),
          m_name:res.data.data.m.nickname,
          m_avatar:res.data.data.m.avatar,
          jf: res.data.data.jf,
          t_money: res.data.data.t_money,
        })
      }
    }).catch(error => {
      console.log(error);
    })
  },
  //跳转到账单查询页面
  goToHisOrder() {
    wx.navigateTo({
      url: "/pages/historyorders/historyorders"
    })
  },
  // 点击我的足迹
  goToFootprint(){
    wx.navigateTo({
      url: '/packageB/pages/footprint/index?is_comtype=community',
    })
  }
})