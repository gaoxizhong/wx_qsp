const app = getApp()
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member_id:'',
    result_today:0,  // 今日赞数
    money_today:0.00,
    total_price:0.00,
    latitude: '',
    longitude: '',
    canIUseGetUserProfile: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 转百度定位坐标
    publicMethod.zhuan_baidu(this);
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
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
    let that = this;
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
      return
    } else {
      that.setData({
        pop2: false
      })
      that.getdata();
    }
  },
  getdata(){
    let that = this;
    that.getCodeSession();
    that.getWallet();
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
  getCodeSession(){
    let that = this;
    common.get('/content/tree', {
      member_id: wx.getStorageSync('member_id'),
      search:1,
    }).then(res => {
      console.log(res)
      that.setData({
        today_likes: res.data.data.today_likes,
        result_today:(res.data.data.today_likes/100).toFixed(2)
      });
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  // 点击种一颗摇钱树
  conversion_btn(){
    let that = this;
    wx.showLoading({
      title:'栽种中...',
    })
    common.get("/content/tree",{
      member_id:wx.getStorageSync('member_id'),
      longitude: that.data.longitude,
      latitude: that.data.latitude
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        that.setData({
          today_likes:res.data.data.today_likes,
          result_today:(res.data.data.today_likes/100).toFixed(2)
        })
        let content_id = res.data.data.content_id;

        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration:1500,
        })
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          complete(res){
            wx.reLaunch({
              url: '/pages/circle/circle?is_circle=0&id=' + content_id,
            })
          }
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

  // 获取钱包额度
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
  gototixian(){
    let that = this;
    let url = '/pages/mine/walletChild/index?menber_id=' + wx.getStorageSync('member_id');
    wx.navigateTo({
      url: url,
    })
  },
  jizan_btn(){
    let that = this;
    let url = '/pages/mine/myContent/index?id=' + wx.getStorageSync('member_id');
    wx.navigateTo({
      url: url,
    })
  },

})