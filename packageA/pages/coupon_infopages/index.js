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
    all_info:{},
    is_block:true,
    business_id:'',
    sele_info:{},
    select_id:'',
    is_limit:false,
    items: [
      {value: '7', name: '7天'},
      {value: '14', name: '14天'},
      {value: '30', name: '30天'},
      {value: '60', name: '60天'},
    ],
    select_time:0,
    select_name:'',
    is_progress:false,
    bar_number:0,
    is_promlines:false,
    balance3: 0,
    ad_balance3: 0,
    is_sjzs: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      all_info:wx.getStorageSync('all_info'),
      business_id: options.business_id
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
    console.log(that.data.sele_info)
    if(JSON.stringify(that.data.sele_info) == "{}"){
      wx.showToast({
        title: '请先选择要推广的商品或优惠券',
        icon:'none',
        duration:2000
      })
      return
    }
    that.setData({
      is_limit:true
    })
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
  promlines_btn(){
    let that = this;
    let all_info = that.data.all_info;
    let select_id = that.data.select_id;
    let select_type = that.data.select_type;
    let is_block = that.data.is_block;
    let select_time = that.data.select_time;
    if(!is_block){
      return
    }
    that.setData({
      is_block:false,
    })
    let pream = {
      all_info,
      select_id,
      coupon_id:select_id,
      select_type,
      select_time,
      pay_member_id:wx.getStorageSync('member_id'),
    };
    if(pream.select_type == '1'){
      pream.coupon_id = 0
    }
    common.post("/content_personal/pay_integral",pream).then(res =>{
      if(res.data.code == 200){
        that.setData({
          is_promlines:false,
        })
        that.progress_bar();
        return;
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 2000
        })
        that.setData({
          is_block:true,
        })
      }
    }).catch(e =>{
      that.setData({
        is_block:true
      })
      console.log(e)
    })
  },
  gotocreate(){
    wx.navigateTo({
      url: '/pages/create_activity/create_activity?currentTab=2'  + '&business_id=' + this.data.business_id,
    })
  },
  // 设置推广有效期弹窗
  radioChange(e) {
    let that = this;
    const items = that.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value;
      if(items[i].value === e.detail.value){
        that.setData({
          select_name:items[i].name
        })
      }
    }
    that.setData({
      items,
      select_time:e.detail.value,
    })

    console.log(e)
  },
  // 推广期限弹窗确认按钮
  limit_btn(){
    let that = this;
    let select_time = that.data.select_time;
    if(select_time == 0){
      wx.showToast({
        title: '请选择推广天数',
        icon:'none',
      })
      return
    }else{
      // that.getad_balance();
      that.setData({
        is_limit:false,
        is_sjzs: true,
      })
    }
    
  },
  sjzs_btn(){
    let that = this;
    that.setData({
      is_sjzs:false,
    })
    that.promlines_btn();
    
  },
  layer_move(){
    return 
  },



  // 进度条动画
  progress_bar(){
    let that = this;
    that.setData({
      is_progress:true
    })
    let timer = setInterval(function(){
      that.setData({
        bar_number : that.data.bar_number+1
      })
      if(that.data.bar_number == 100){
        clearInterval(timer);
        that.setData({
          is_progress: false
        })
        wx.showToast({
          title: '开始推送！',
          icon: 'success',
          duration: 2000,
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '/packageA/pages/merchant_entrance/index',
          })
        },2000)
      }
      return
    },50)
  },
  is_limit_layer(){
    let that = this;
    that.setData({
      is_limit: false,
    })
  },
  is_sjzs_layer(){
    let that = this;
    that.setData({
      is_sjzs: false,
    })
  },
  is_promlines_layer(){
    let that = this;
    that.setData({
      is_promlines: false,
    })
  },
  getad_balance(){
    let that = this;
    common.get('/ad/index',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          balance3: res.data.data.balance3,
          ad_balance3: res.data.data.ad_balance3
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  gotoqingwaad(){
    wx.navigateTo({
      url: '/packageA/pages/merchant_entrance/index',
    })
  }
})