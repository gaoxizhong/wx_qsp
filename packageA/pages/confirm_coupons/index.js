const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirm_coupons:{},
    total_price:0,
    jiage:'0.00',
    money:'0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      confirm_coupons: app.data.confirm_coupons,
    })
    if(options.jiage){
      that.setData({
        jiage: options.jiage,
        money:options.jiage,
      })
    }
    console.log(app.data.confirm_coupons)
    that.jine();
    // 禁止右上角转发
    wx.hideShareMenu();
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
  jine() {
    let that = this;
    common.get('/memberinfo/indexWithdraw', {
      member_id: wx.getStorageSync('member_id')
    }).then(res => {
      console.log(res)
      that.setData({
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
  // 点击拒绝
  delt_coupon(){
    let that = this;
    let confirm_coupons = that.data.confirm_coupons;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    common.get("/content_personal/byfuli",{
      id: confirm_coupons.data.del_id
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '以为您拒绝此优惠邀请!',
          duration:2000,
          icon:'none'
        })
        that.getWallet();
        that.change1();
        setTimeout(function(){
          app.data.confirm_coupons= {};
          prevPage.setData({
            isReset: 1,
            is_circle: 1
          })
          wx.navigateBack({
            delta: 1
          })
        },2500)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: res.data.message,
        cion:'none'
      })
    })
    console.log(that.data.confirm_coupons)
  },
  // 点击收下
  xuyao_coupon(){
    let that = this;
    let confirm_coupons = that.data.confirm_coupons;
    let jiage = that.data.money;
    let id = confirm_coupons.data.id;
    wx.navigateTo({
      url: "/packageA/pages/coupon_detail/index?id=" + id  + '&jiage=' + jiage + '&is_blindBox=1',
    })
    return
    common.post("/content_personal/pay_yhq",{
      del_id: confirm_coupons.data.del_id,
      coupon_price: confirm_coupons.data.coupon_price,
      coupon_integral: confirm_coupons.data.coupon_integral,
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.getWallet();
        that.change();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: res.data.message,
        cion:'none'
      })
    })
  },
  // 商品
  audit_btn(e){
    let that = this;
    console.log(e)
    let jiage = that.data.jiage;
    let status = e.currentTarget.dataset.status;
    let confirm_coupons = that.data.confirm_coupons;
    let discount_id = confirm_coupons.data.id;
    let business_id = confirm_coupons.data.business_id;
    wx.navigateTo({
      url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('memner_id') + "&discount_id=" + discount_id + "&is_audit=1" + '&jiage=' + jiage + '&is_blindBox=1',
    })
    return
    common.get('/content_personal/audit',{
      status,
      detail_id: confirm_coupons.data.detail_id,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.getWallet();
        app.data.confirm_coupons= {};
        if(status == 1){
          let discount_id = confirm_coupons.data.id;
          let business_id = confirm_coupons.data.business_id;
          that.change();
          setTimeout(function(){
            wx.navigateTo({
              url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&member_id=" + wx.getStorageSync('memner_id') + "&discount_id=" + discount_id + "&is_audit=1",
            })
          },1500)

        }else if(status == 2){
          that.change1();
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2500)
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
        setTimeout(function(){
          prevPage.setData({
            isReset: 1,
            is_circle: 1
          })
          wx.navigateBack({
            delta: 1
          })
        },1500)
        return;
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  // 加0.21元动画
  change() {
    let that = this;
    that.animate('.jia-jifen', [
      { opacity: 0, bottom: '60rpx'},
      { opacity: 1, bottom: '150rpx'},
    ], 100, function () {
      setTimeout(function(){
        that.clearAnimation('.jia-jifen', function () {
        console.log("清除了动画属性")
      })
        },1000)
    }.bind(that)
    )
  },
  // 加0.1元动画
  change1() {
    let that = this;
    that.animate('.jia-jifen2', [
      { opacity: 0, bottom: '60rpx'},
      { opacity: 1, bottom: '150rpx'},
    ], 100, function () {
      setTimeout(function(){
        that.clearAnimation('.jia-jifen2', function () {
        console.log("清除了动画属性")
      })
        },1000)
    }.bind(that)
    )
  },

  getWallet(){
    let that = this;
    common.get("/memberinfo/getWallet",{
      member_id:wx.getStorageSync('member_id')
    }).then(res =>{
      console.log(res.data)
        that.setData({
          total_price: res.data.total_price
        })
    })
  }
})