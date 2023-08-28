const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    to_start_list:[],
    select_index: -1,
    id:'',
    is_promlines: false,
    total_price:199,
    is_block:true,
    money:'',
    min_money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getlist();
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

  getlist(){
    let that = this;
    common.get('/public_welfare/list',{}).then(res =>{
      if(res.data.code == 200){
        that.setData({
          to_start_list: res.data.data.to_start_list
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e =>{
      console.log(e)
    })
  },
  select_items(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let status = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id;
    let money = e.currentTarget.dataset.money/100;
    let min_money = e.currentTarget.dataset.min_money;

    if(status == 1){
      wx.showToast({
        title: '本期已有商家赞助',
        icon:"none"
      })
      return
    }else{
      that.setData({
        id,
        select_index: index,
        money,
        min_money
      })
    }

  },
  confirm_btn(){
    let that = this;
    let id = that.data.id;
    if(id == '' || !id){
      wx.showToast({
        title: '请先选择活动',
        icon:'none',
      })
      return
    }else{
      that.getad_balance();
      that.setData({
        is_promlines: true,
      })
    }
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
  promlines_btn(){
    let that = this;
    let is_block = that.data.is_block; // 防止多次点击提交
    let all_info = wx.getStorageSync('apenny_info_ad'); // 商品对象数据
    let select_type = wx.getStorageSync('apenny_type_ad');// 商品或者优惠券 1 商品 2 优惠券
    let select_id = all_info.discount_id || all_info.id; // 商品或者优惠券id
    // let select_time = that.data.select_time;
    // let distance = that.data.distance_time;
    let id = that.data.id; 
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
      welfare_id:id,
      member_id:wx.getStorageSync('member_id'),
      pay_member_id:wx.getStorageSync('member_id'),
      type: 4,
      lng: that.data.longitude,
      lat: that.data.latitude,
    };
    common.post("/referraltraffic/add",pream).then(res =>{
      if(res.data.code == 200){
        wx.setStorageSync('apenny_info_ad', {});
        wx.setStorageSync('apenny_type_ad', 0);
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
    })
  },
  is_promlines_layer(){
    let that = this;
    that.setData({
      is_promlines: false,
    })
  },
})