const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signCircle:{}, // 签到动态数据
    savaStatus: true,
    longitude: '',
    latitude: '',
    like_status:true,
    result_today:0,  // 今日赞数
    content_laud_count:0,  // 今日签到的赞数
    result_yestoday:0,  // 昨日赞数
    result_yestoday1: 0.00, // 昨日可兑换钱数
    money_today:0,
    total_price:0.00,
    content_uid: 0, // 选中当前的动态发布的用户id
    selt_id:0, // 选中当前的动态id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      latitude : app.globalData.latitude,
      longitude : app.globalData.longitude,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      latitude : app.globalData.latitude,
      longitude : app.globalData.longitude,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      member_id: wx.getStorageSync('member_id'),
      latitude : app.globalData.latitude,
      longitude : app.globalData.longitude,
    })
    this.getsignCircle(); // 签到首页数据
    this.getCodeSession(); // 集赞数据

  },
  //  获取首页数据
  getsignCircle(){
    let that = this;
    common.get('/mine/index?op=sign_home',{
      member_id: wx.getStorageSync('member_id'),
      // member_id: 166758,
      lat: that.data.latitude,
      lng: that.data.longitude
    }).then(res =>{
      if(res.data.code == 200){
        that.setData({
          signCircle: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch(e =>{
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
  // 点击去提现
  goToWallet() {
    wx.navigateTo({
      url: '/pages/mine/wallet/index'
    })
  },

  // 点击点赞按钮
  signLike(e){
    let that = this;
    let lat = that.data.latitude;
    let lng = that.data.longitude;
    let is_like =  '2'; // 点赞按钮
    let ind = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if(!id || id == ''){
      wx.showToast({
        title: '对方今日暂未签到！',
        icon:'none'
      })
      return
    }
    // if (that.data.member_id == e.currentTarget.dataset.mid){
    //   wx.showToast({
    //     title: "不可点赞自己发布的！",
    //     icon:'none'
    //   })
    //   return;
    // }
    let like_status = that.data.like_status;
    if(!like_status){
      wx.showToast({
        title: '请勿频繁点击！',
        icon:'none'
      })
      return
    }
    that.setData({
      like_status: false
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    common.get('/content/praise', {
      member_id: that.data.member_id,
      content_id: e.currentTarget.dataset.id,
      lat,
      lng,
      is_like,
    }).then(res => {
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: '回赞成功！',
        })
        setTimeout(function(){
          let signCircle = that.data.signCircle;
          publicMethod.gotosetint_transac(that);
          signCircle.my_gift[ind].member_content.laud_count = parseFloat(that.data.signCircle.my_gift[ind].member_content.laud_count) + 1;
          signCircle.my_gift[ind].member_content.laud_status = 1;
          that.setData({
            signCircle,
            like_status: true
            })
    // =============================== ↓ =====================================
            // 授权订阅消息
            wx.requestSubscribeMessage({   // 调起消息订阅界面
              tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
              complete (res) { 
              },
            })  
    // ================================= ↑ =======================================
        },1000)

      }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration: 2000
          })
          that.setData({
            like_status: true
          })

      }
    }).catch(e => {
      wx.hideLoading();
      app.showToast({
        title: "数据异常",
      })
      that.setData({
        like_status: true
      })
      console.log(e)
    })
  },


  getCodeSession(){
    let that = this;
    common.get('/content/getLikes', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        that.setData({
          result_today: res.data.data.result_today,
          result_today1: Number(res.data.data.result_today/100).toFixed(2),
          result_yestoday: res.data.data.result_yestoday,
          result_yestoday1: Number(res.data.data.result_yestoday/100).toFixed(2),  // 可兑换金额
          money_today:res.data.data.money_today,
        });
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
  // 转换金额
  conversion_btn(){
    let that = this;
    wx.showLoading({
      title:'转换中...'
    })
    let result_yestoday = that.data.result_yestoday;
    common.get("/content/getLikesMoney",{
      member_id:wx.getStorageSync('member_id'),
      result_yestoday,
      longitude: that.data.longitude,
      latitude: that.data.latitude
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration:1500,
        })
        that.getCodeSession();
        that.getsignCircle();
        // 授权订阅消息
        wx.requestSubscribeMessage({   // 调起消息订阅界面
          tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls'],
          complete(res){
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
    // 点击回个花花
  clickisGift(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let content_uid =  e.currentTarget.dataset.mid;
    if(!id || id == '' || id == 0){
      wx.showToast({
        title: '对方今日暂未签到！',
        icon:'none'
      })
      return
    }
    this.setData({
      is_gift: true,
      selt_id: id,
      content_uid
    })
  },

  show_poster(){
    this.getsignCircle();
  },
  goOtherCircle(e) { //去别人的发圈
    let that = this;
    wx.navigateTo({
      url: '/pages/mine/myContent/index?id=' + e.currentTarget.dataset.id,
    })
  },
})