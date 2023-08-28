const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_price:0,
    select_type: '',
    select_id: '',
    traffic_id:'',
    is_judge: 0,
    confirm_coupons:{},
    is_debug:true,
    is_houtui:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    
    if(options.select_type){
      that.setData({
        select_type: options.select_type,
        select_id: options.select_id,
        traffic_id: options.traffic_id,
      })
    }

    if(options.is_judge){
      let confirm_coupons = app.data.confirm_coupons;
      console.log(confirm_coupons);
      that.setData({
        confirm_coupons,
        is_judge: options.is_judge,
        select_type: confirm_coupons.tab.select_type,
        select_id: confirm_coupons.data.id,
      })
    }

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      is_circle: 1,
    })
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
    let that = this;
    let is_houtui = that.data.is_houtui;
    if(is_houtui == 1){
      wx.navigateBack({
        delta: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      is_houtui: 0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      is_houtui: 0
    })
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
  // 引流广告、
  blindbox_btn(){
    let that = this;
    let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    let is_debug = that.data.is_debug;
    if(!is_debug){
      wx.showToast({
        title: '请勿重复点击',
        icon:'none'
      })
      return
    }
    wx.showToast({
      title: '哇偶~ 盲盒正在打开...',
      icon:'none',
      duration: 2000
    })
    common.post("/referraltraffic/record",{
      traffic_id: that.data.traffic_id,
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        // prevPage.setData({
        //   isReset: 1,
        // })
        setTimeout(function(){
          let jiage = res.data.money;
          let url = '';
          let select_id = that.data.select_id;
          if(that.data.select_type == 1){
            url = '/pages/dicount_good/dicount_good?discount_id=' + select_id + '&jiage=' + jiage + '&is_blindBox=1';
          }else if(that.data.select_type == 2){
            url = '/packageA/pages/coupon_detail/index?id=' + select_id + '&jiage=' + jiage + '&is_blindBox=1';
          }
          wx.navigateTo({
            url,
          })
        },1500)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 2000
        })
        that.setData({
          is_debug: true
        })
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: res.data.message,
        icon:'none',
        duration: 2000
      })
      that.setData({
        is_debug: true
      })
    })
  },
  // 快速推广、优惠券
  xuyao_coupon(){
    let that = this;
    let confirm_coupons = that.data.confirm_coupons;
    let is_debug = that.data.is_debug;
    if(!is_debug){
      wx.showToast({
        title: '请勿重复点击',
        icon:'none'
      })
      return
    }
    wx.showToast({
      title: '哇偶~ 盲盒正在打开...',
      icon:'none',
      duration: 2000
    })
    common.get("/content_personal/byfuli",{
      id: confirm_coupons.data.del_id
    }).then(res =>{
      if(res.data.code == 200){
        setTimeout(function(){
          let jiage = res.data.money;
          let id = confirm_coupons.data.id;
          wx.navigateTo({
            url: "/packageA/pages/coupon_detail/index?id=" + id  + '&jiage=' + jiage + '&is_blindBox=1',
          })
        },1500)

      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 2000
        })
        that.setData({
          is_debug: true
        })
      }
    }).catch(e =>{
      console.log(e)
      wx.showToast({
        title: res.data.message,
        cion:'none'
      })
      that.setData({
        is_debug: true
      })
    })
  },
  // 快速推广、商品
  audit_btn(e){
    let that = this;
    let status = '1';
    let confirm_coupons = that.data.confirm_coupons;
    let is_debug = that.data.is_debug;
    if(!is_debug){
      wx.showToast({
        title: '请勿重复点击',
        icon:'none'
      })
      return
    }
    wx.showToast({
      title: '哇偶~ 盲盒正在打开...',
      icon:'none',
      duration: 2000
    })
    common.get('/content_personal/audit',{
      status,
      detail_id: confirm_coupons.data.detail_id,
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        app.data.confirm_coupons= {};
        setTimeout(function(){
          let jiage = res.data.money;
          if(status == 1){
            let discount_id = confirm_coupons.data.id;
            let business_id = confirm_coupons.data.business_id;
            setTimeout(function(){
              wx.navigateTo({
                url: "/pages/dicount_good/dicount_good?business_id=" + business_id + "&discount_id=" + discount_id + '&jiage=' + jiage + '&is_blindBox=1',
              })
            },1500)
          }else if(status == 2){
            wx.navigateBack({
              delta: 1
            })
          }
        },1500)

      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
        that.setData({
          is_debug: true
        })
        return;
      }
    }).catch(e =>{
      that.setData({
        is_debug: true
      })
      console.log(e)
    })
  },
})