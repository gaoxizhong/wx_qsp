const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirm_coupons:{},
    total_price:0,
    select_type: '',
    select_id: '',
    traffic_id:'',
    jiage:'0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      select_type: options.select_type,
      select_id: options.select_id,
      traffic_id: options.traffic_id,
    })
    if(that.data.select_type == 1){
      let dis_id = that.data.select_id;
      that.getshop(that,dis_id);
    }else if(that.data.select_type == 2){
      let coupon_id = that.data.select_id;
      that.getcoupon(that,coupon_id);
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      is_circle: 1
    })
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
    let swiper_data = that.data.swiper_data;
    common.get("/content_personal/byfuli",{
      id: swiper_data[0].data.del_id
    }).then(res =>{
      if(res.data.code == 200){
        let jiage = res.data.money;
        that.getWallet();
        that.change1();
        let id = swiper_data[0].data.id;
        setTimeout(function(){
          wx.navigateTo({
            url: "/packageA/pages/coupon_detail/index?id=" + id  + '&jiage=' + jiage + '&is_blindBox=1',
          })
        },2000)
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
    console.log(that.data.swiper_data)
  },
  // 点击收下
  xuyao_coupon(){
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    common.post("/referraltraffic/record",{
      traffic_id: that.data.traffic_id,
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        prevPage.setData({
          isReset: 1,
        })
        that.getWallet();
        that.change();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        setTimeout(function(){
          let url = '';
          let select_id = that.data.select_id;
          if(that.data.select_type == 1){
            url = '/pages/dicount_good/dicount_good?discount_id=' + select_id
          }else if(that.data.select_type == 2){
            url = '/packageA/pages/coupon_detail/index?id=' + select_id
          }
          wx.navigateTo({
            url,
          })
        },1500)
        return;
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: res.data.message,
        cion:'none'
      })
    })
  },
  change() {
    let that = this;
    that.animate('.jia-jifen', [
      { opacity: 0, bottom: '60rpx'},
      { opacity: 1, bottom: '150rpx'},
    ], 100, function () {
      setTimeout(function(){
        that.clearAnimation('.jia-jifen', function () {
        console.log("清除了动画属性")
      });
        let url = '';
        let select_id = that.data.select_id;
        if(that.data.select_type == 1){
          url = '/pages/dicount_good/dicount_good?discount_id=' + select_id
        }else if(that.data.select_type == 2){
          url = '/packageA/pages/coupon_detail/index?id=' + select_id
        }
        wx.navigateTo({
          url,
        })
        },1500)
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
  // 点击商品的了解一下
  audit_btn(e){
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
      common.post("/referraltraffic/record",{
        traffic_id: that.data.traffic_id,
        member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        prevPage.setData({
          isReset: 1,
        })
        that.getWallet();
        that.change();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
        setTimeout(function(){
          let url = '';
          let select_id = that.data.select_id;
          if(that.data.select_type == 1){
            url = '/pages/dicount_good/dicount_good?discount_id=' + select_id
          }else if(that.data.select_type == 2){
            url = '/packageA/pages/coupon_detail/index?id=' + select_id
          }
          wx.navigateTo({
            url,
          })
        },1500)
        return;
      }
    }).catch(e =>{
      console.log(e)
    })
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
  },
  getshop(t,dis_id){
    let that = t;
    let discount_id = dis_id;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/business/getBusinessDiscount',{
      discount_id,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        that.setData({
          confirm_coupons:res.data.data[0],
        })
      }else{
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
  getcoupon(t,coupon_id){
    let that = t;
    let id = coupon_id;
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/coupon/details',{
      id,
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        that.setData({
          confirm_coupons:res.data.data[0],
        })
      }else{
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        })
      }
    }).catch(e =>{
      wx.hideLoading();
      console.log(e)
    })
  },
})