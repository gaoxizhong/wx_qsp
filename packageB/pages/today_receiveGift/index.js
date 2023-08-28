const app = getApp();
const common = require('../../../assets/js/common');
const publicMethod = require('../../../assets/js/publicMethod');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_giftinfo: {}, // 我的数据信息
    savaStatus: true,
    // ======   礼物弹窗数据
    is_gift: false,
    content_uid: 0, // 选中当前的动态发布的用户id
    selt_id:0, // 选中当前的动态id
    like_status: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      member_id: wx.getStorageSync('member_id'),
      latitude : app.globalData.latitude,
      longitude : app.globalData.longitude,
    })
    this.getmy_giftinfo(); // 收到的礼物列表

  },
   // 获取我收到的礼物列表
   getmy_giftinfo(){
    let that = this;
    wx.showLoading({
      title: '加载中....',
    })
    common.get('/mine/index?op=my_gift',{
      member_id: wx.getStorageSync('member_id'),
    }).then(res =>{
      wx.hideLoading();
      if(res.data.code == 200){
        that.setData({
          my_giftinfo: res.data.data,
          savaStatus: true,
        })
      }else{
        wx.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e =>{
      wx.hideLoading();
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
  //跳转到账单查询页面
  goToHisOrder() {
    wx.navigateTo({
      url: "/pages/historyorders/historyorders"
    })
  },
    // 点击回个花花
  clickisGift(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let content_uid = e.currentTarget.dataset.content_uid;
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

  // 转换积分
  conversion_btn(){
    let that = this;
    wx.showLoading({
      title:'转换中...'
    })
    let yesterday_gift = that.data.my_giftinfo.yesterday_gift;
    common.get("/mine/index?op=dh_gift",{
      member_id:wx.getStorageSync('member_id'),
      yesterday_gift,
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
        that.getmy_giftinfo();
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
          let my_giftinfo = that.data.my_giftinfo;
          publicMethod.gotosetint_transac(that);
          my_giftinfo.my_gift[ind].member_content.laud_count = parseFloat(that.data.my_giftinfo.my_gift[ind].member_content.laud_count) + 1;
          my_giftinfo.my_gift[ind].laud_status = 1;
          that.setData({
            my_giftinfo,
            like_status: true
          })
    // =============================== ↓ =====================================
            // 授权订阅消息
            wx.requestSubscribeMessage({   // 调起消息订阅界面
              tmplIds: ['8hlnwZd_geXb1g38pEaQFdNnhirnc5wkXaHoGJn4Pls','1neA-pyIpkUR4Asv__QNuyCbM4rVIvaoluNlc6XdCJo'],
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
  show_poster(){
    this.getmy_giftinfo();
  },
  goOtherCircle(e) { //去别人的发圈
    let that = this;
    wx.navigateTo({
      url: '/pages/mine/myContent/index?id=' + e.currentTarget.dataset.id,
    })
  },
})