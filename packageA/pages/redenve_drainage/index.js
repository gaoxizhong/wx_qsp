const common = require("../../../assets/js/common");
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_type_moving: 0,
    sele_info_moving:'',
    is_bullet:false,
    yulian_info:{},
    items: [
      {value: '1', name: '1天'},
      {value: '2', name: '2天'},
      {value: '3', name: '3天'},
      {value: '5', name: '5天'},
    ],
    distance_items: [
      {value: '6', name: '3公里'},
      {value: '10', name: '5公里'},
      {value: '20', name: '10公里'},
      {value: '10000', name: '全域'},
    ],
    select_time:0,
    distance_time:0,
    is_distance:false,
    is_limit:false,
    is_promlines:false,
    is_block:true,
    balance3: 0,
    ad_balance3: 0,
    latitude: '',
    longitude: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
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
    let sele_info_moving = wx.getStorageSync('sele_info_moving2');
    let select_type_moving = wx.getStorageSync('select_type_moving2');
    console.log(select_type_moving)
    that.setData({
      sele_info_moving,
      select_type_moving
    })
    console.log(that.data.sele_info_moving)

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
  gotosele(){
    wx.navigateTo({
      url: '/packageA/pages/tool_choosepages/index?is_redbao=1',
    })
  },
  goRedstyle(){
    let select_type_moving = this.data.select_type_moving;
    if(!select_type_moving){
      wx.showToast({
        title: '请先选择要推广的商品/优惠券',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/packageA/pages/redenve_style/index',
    })
  },
  // 点击确认选择
  confirm_btn(e){
    let that = this;
    let select_type_moving = this.data.select_type_moving;
    if(!select_type_moving){
      wx.showToast({
        title: '请先选择要推广的商品/优惠券',
        icon: 'none'
      })
      return
    }
    that.setData({
      is_distance:true
    })
  },
  // 设置推广距离弹窗
  distanceChange(e){
    let that = this;
    const distance_items = that.data.distance_items;
    for (let i = 0, len = distance_items.length; i < len; ++i) {
      distance_items[i].checked = distance_items[i].value === e.detail.value
    }
    that.setData({
      distance_items,
      distance_time:e.detail.value
    })
    console.log(that.data.distance_time)

  },
  // 推广期限弹窗确认按钮
  distance_btn(){
    let that = this;
    let distance_time = that.data.distance_time;
    if(distance_time == 0){
      wx.showToast({
        title: '请选择推广距离',
        icon:'none',
      })
      return
    }else{
      that.setData({
        is_distance: false,
        is_limit:true,
      })
    }
  },
  // 设置推广有效期弹窗
  radioChange(e) {
    let that = this;
    const items = that.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    that.setData({
      items,
      select_time:e.detail.value,
      total_price: Number(e.detail.value*199),
    })
    console.log(that.data.select_time)
  },
  // 获取广告账户余额
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
  promlines_btn(){
    let that = this;
    let all_info = wx.getStorageSync('sele_info_moving2'); // 商品对象数据
    let select_type = wx.getStorageSync('select_type_moving2');// 商品或者优惠券 1 商品 2 优惠券
    let select_id = all_info.discount_id || all_info.id; // 商品或者优惠券id
    let is_block = that.data.is_block; 
    let select_time = that.data.select_time; // 推广时间
    let distance = that.data.distance_time; // 推广距离
    if(!is_block){
      wx.showToast({
        title: '请勿重复提交！',
        none:'none'
      })
      return
    }
    that.setData({
      is_block:false,
    })
    let pream = {
      select_id,
      select_type,
      distance,
      time: select_time,
      member_id:wx.getStorageSync('member_id'),
      pay_member_id:wx.getStorageSync('member_id'),
      type: 1,
      lng: that.data.longitude,
      lat: that.data.latitude,
    };
    common.post("/referraltraffic/add",pream).then(res =>{
      if(res.data.code == 200){
        wx.setStorageSync('sele_info_moving2', {});
        wx.setStorageSync('select_type_moving2', 0);
        that.setData({
          is_promlines:false,
        })
        wx.showToast({
          title: '投放成功！',
          icon:'none',
          duration: 2000
        })
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/circle/circle',
          })
        },1500)
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
      wx.showToast({
        title: e.data.message,
        icon:'none',
        duration: 2000
      })
    })
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
      that.getad_balance();
      that.setData({
        is_limit:false,
        is_promlines: true,
      })
    }
  },
  // 设置推广有效期弹窗蒙层
  is_limit_layer(){
    let that = this;
    that.setData({
      is_limit: false,
    })
  },
  // 设置推广距离蒙层
  is_distance_layer(){
    let that = this;
    that.setData({
      is_distance: false,
    })
  },
  // 扣推广账户金额弹窗蒙层
  is_promlines_layer(){
    let that = this;
    that.setData({
      is_promlines: false,
    })
  },
})