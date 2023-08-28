const app = getApp();
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items_info:[],
    member_id:'',
    select_type:1,
    useinter_info:{},
    volunacti_list:[],
    page:1,
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
    })


  },
  getReferraltraffic(){
    let that = this;
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '数据读取中...',
      icon:'none'
    })
    common.get('/referraltraffic/index',{
      member_id: wx.getStorageSync('member_id'),
      page: that.data.page,
      type: that.data.select_type
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let newlist = res.data.data.list;
        let flag = newlist.length > 0;
        that.setData({
          volunacti_list: that.data.volunacti_list.concat( newlist ),
          hasMore: flag,
        })
      }else{
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
    if(that.data.select_type == 4){
      //  快速推广
      that.getlistinfo();
    }else if(that.data.select_type == 5){
      // 持续推广
      that.view_usage();
    }else{
      that.getReferraltraffic();
    }
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
    let that = this;
    that.setData({
      volunacti_list: [],
      items_info: [],
      page:1,
      hasMore:true
    })
    if(that.data.select_type == '1' || that.data.select_type == '2' || that.data.select_type == '3'){
      that.getReferraltraffic();
    }
    if(that.data.select_type == '4'){
      that.getlistinfo();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      page:(that.data.page + 1),
    })
    if(that.data.select_type == '1' || that.data.select_type == '2' || that.data.select_type == '3'){
      that.getReferraltraffic();
    }
    if(that.data.select_type == '4'){
      that.getlistinfo();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取快速推广
  getlistinfo(){
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (!that.data.hasMore) {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '数据读取中，请稍候...',
      icon:'none'
    })
    
    common.get("/content_personal/view_detail",{
      member_id,
      page: that.data.page
    }).then( res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        let newlist =  res.data.data;
        let flag = newlist.length > 0;
        that.setData({
          items_info: that.data.items_info.concat( newlist ),
          hasMore: flag,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch( e=>{
      wx.hideLoading();
      console.log(e)
    })
  },
  // 获取持续
  view_usage(){
    let that = this;
    common.get('/agent/ad_usage',{
      member_id:wx.getStorageSync('member_id'),
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          useinter_info:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this;
    var cur = e.currentTarget.dataset.current;
    that.setData({
      select_type: cur,
    })
    if (cur == 5) {
      // 持续推广
      that.view_usage();
    } else if (cur == 4) {
      that.setData({
        items_info:[],
        page:1,
        hasMore: true
      })
      // 快速推广
      that.getlistinfo();
    }else{
      that.setData({
        volunacti_list:[],
        page:1,
        hasMore: true
      })
      that.getReferraltraffic();
    }

  },

})