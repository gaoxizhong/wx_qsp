const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_type:1,
    coupon_list: [],
    shopData:[],
    select_index:0,
    is_block:true,
    business_id:'',
    sele_info:{},
    select_id:'',
    is_redbao: 0, // banner红包
    is_text: 0,   // 内容引流
    is_apenny:0, 
    is_merchantBuy:0,
    items: [
      {value: '7', name: '7天'},
      {value: '14', name: '14天'},
      {value: '30', name: '30天'},
      {value: '60', name: '60天'},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if(options.is_redbao){
      that.setData({
        is_redbao: options.is_redbao,
      })
    }
    if(options.is_merchantBuy){
      that.setData({
        is_merchantBuy: options.is_merchantBuy,
      })
    }
    if(options.is_text){
      that.setData({
        is_text: options.is_text,
      })
    }
    if(options.is_apenny){
      that.setData({
        is_apenny: options.is_apenny,
      })
    }
    that.setData({
      business_id: wx.getStorageSync('business_id'),
    })
    if(that.data.select_type == 1){
      that.getshopData();
    }else if(that.data.select_type == 2){
      that.getcouponlist();
    }
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
      is_block:true
    })
    if(this.data.is_apenny == 1){
      wx.setStorageSync('apenny_info_ad', {});
      wx.setStorageSync('apenny_type_ad', 0);
    }else if(this.data.is_text == 1){
      wx.setStorageSync('sele_info_moving3', {});
      wx.setStorageSync('select_type_moving3', 0);
    }else if(this.data.is_redbao == 1){
      wx.setStorageSync('sele_info_moving2', {});
      wx.setStorageSync('select_type_moving2', 0);
    }else if(this.data.is_merchantBuy == 1){
      wx.setStorageSync('sele_MerchantBuy_info', {});
      wx.setStorageSync('sele_MerchantBuy_type', 0);
    }else {
      wx.setStorageSync('sele_info_moving', {});
      wx.setStorageSync('select_type_moving', 0);
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this
    var cur = e.currentTarget.dataset.current;
    if (cur == 2) {
      // 优惠券
      that.getcouponlist();
    } else if (cur == 1) {
      // 商品
      that.getshopData();
    }
    that.setData({
      select_type: cur,
      select_id: '',
      sele_info:{},
    })
    console.log(that.data.select_id)
    console.log(that.data.select_type)
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
    wx.stopPullDownRefresh();
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
  //商品列表
  getshopData() { 
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    common.get('/business/discountList', {
      business_id: that.data.business_id,
    }).then(res => {
      wx.hideLoading();
      let shopData = res.data.data;
      if(shopData){
        shopData.forEach(ele =>{
          ele.chend = false;
        })
      }
      that.setData({
        shopData,
      })
    }).catch(e => {
      wx.hideLoading();
      console.log(e)
    })
  },
  // 获取优惠券
  getcouponlist(){
    let that = this;
    wx.showLoading({
      title:'加载中...',
    });
    common.get("/content_personal/business_coupon",{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        wx.hideLoading();
        let coupon_list = res.data.data;
        let business_id = res.data.business_id;
        if(coupon_list){
          coupon_list.forEach(ele =>{
            ele.chend = false;
          })
        }
        that.setData({
          coupon_list,
          business_id
        })
      }else{
        wx.hideLoading();
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
  // 选择优惠券
  select_items(e){
    let that = this;
    let coupon_list = that.data.coupon_list;
    let select_index = e.detail;
    coupon_list.forEach(ele =>{
      ele.chend = false
    })
    coupon_list[select_index].chend = true;
    that.setData({
      select_id:coupon_list[select_index].id,
      coupon_list,
      select_index,
      sele_info: coupon_list[select_index],
    })
    console.log(that.data.select_id)
    console.log(that.data.sele_info)
  },
  // 选择商品
  select_shopdata(e){
    let that = this;
    let shopData = that.data.shopData;
    let shopData_index = e.currentTarget.dataset.index;
    let select_id = e.currentTarget.dataset.discount_id;
    shopData.forEach(ele =>{
      ele.chend = false
    })
    shopData[shopData_index].chend = true;
    that.setData({
      shopData,
      shopData_index,
      select_id,
      sele_info: shopData[shopData_index],
    })
    console.log(that.data.select_id)
  },
  // 点击确认发送
  confirm_send(){
    let that = this;
    if(JSON.stringify(that.data.sele_info) == "{}"){
      wx.showToast({
        title: '请先选择要推广的商品或优惠券',
        icon:'none',
        duration:2000
      })
      return
    }else{
      if(this.data.is_apenny == 1){
        wx.setStorageSync('apenny_info_ad', that.data.sele_info);
        wx.setStorageSync('apenny_type_ad', that.data.select_type);
      }else if(that.data.is_text == 1 ){
        wx.setStorageSync('sele_info_moving3', that.data.sele_info);
        wx.setStorageSync('select_type_moving3', that.data.select_type);
      }else if(that.data.is_redbao == 1){
        wx.setStorageSync('sele_info_moving2', that.data.sele_info);
        wx.setStorageSync('select_type_moving2', that.data.select_type);
      }else if(that.data.is_merchantBuy == 1){
        wx.setStorageSync('sele_MerchantBuy_info', that.data.sele_info);
        wx.setStorageSync('sele_MerchantBuy_type', that.data.select_type);
      }else{
        wx.setStorageSync('sele_info_moving', that.data.sele_info);
        wx.setStorageSync('select_type_moving', that.data.select_type);
      }
      wx.navigateBack({
        delta: 1,
      })
    }   
  },
  // 不发送优惠券
  nosend_coupon(){
    let that = this;
    let coupon_list = that.data.coupon_list;
    let shopData = that.data.shopData;
    let select_type = that.data.select_type;
    if(select_type == 1){
      shopData.forEach(ele =>{
        ele.chend = false
      })
      that.setData({
        shopData,
      })
    } else if(select_type == 2){
      coupon_list.forEach(ele =>{
        ele.chend = false
      })
      that.setData({
        coupon_list,
      })
    }
    that.setData({
      select_id:'',
      is_limit:true
    })
  },
  gotocreate(){
    wx.navigateTo({
      url: '/pages/create_activity/create_activity?currentTab=2'  + '&business_id=' + this.data.business_id,
    })
  },

  layer_move(){
    return 
  },

})