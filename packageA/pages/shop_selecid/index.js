const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_type:'',
    shopData:[], //  商品列表
    page: 1,
    business_id:'',
    coupon_list:[],
    sele_info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    this.setData({
      select_type: options.select_type,
      business_id: options.business_id
    })
    if(options.select_type == '1'){
      that.getshopData();
    }else if(options.select_type == '2'){
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
      sele_info:{}
    })
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
  //  获取优惠券
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
      coupon_list,
      select_index,
      coupon_id:coupon_list[select_index].id,
      sele_info: coupon_list[select_index],
    })
    console.log(that.data.sele_info)

  },
  // 选择商品
  select_shopdata(e){
    let that = this;
    let shopData = that.data.shopData;
    let shopData_index = e.currentTarget.dataset.index;
    shopData.forEach(ele =>{
      ele.chend = false
    })
    shopData[shopData_index].chend = true;
    that.setData({
      shopData,
      shopData_index,
      coupon_id:shopData[shopData_index].id,
      sele_info: shopData[shopData_index],
    })
  },
  confirm_send(){
    let that = this;
    console.log(that.data.sele_info)
    let sele_info= that.data.sele_info;
    let select_type= that.data.select_type;
    if(JSON.stringify(sele_info) == "{}"){
      wx.showToast({
        title: '请先选择要推广的商品或优惠券',
        icon:'none',
        duration:2000
      })
      return
    }
    app.data.select_type = select_type;

    if(select_type == 1){
      app.data.select_id = sele_info.discount_id;
    }else if(select_type == 2){
      app.data.select_id = sele_info.id;
    }
    wx.navigateBack({
      delta: -1
    })
  }
})