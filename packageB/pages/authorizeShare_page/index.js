const app = getApp()
const common = require('../../../assets/js/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    v_head: '',  //头像
    v_back: '',  //背景
    contact_name : '',
    contact_profile : '',
    contact_phone : '',
    contact_area : '',
    isAgree: false,
    bannerUrls: [],
    isAgreeShow: false,
    longitude:'',
    latitude:'',
    garden:'',
    main_store:'', // 总店id
    main_avatar:'', // 总店头像
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    if(options.main_store){
      that.setData({
        main_store: options.main_store,
        main_avatar: options.main_avatar
      })
    }

    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        console.log(res)
        that.setData({
         latitude : Number(res.latitude),
         longitude : Number(res.longitude)
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '需要开启手机定位',
          icon:'none'
        })
        that.setData({
          latitude: '',
          longitude: ''
        })
      }
    })
    let member_id = wx.getStorageSync('member_id');
    if(!member_id){
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/login_mark/index',
        })
      },2000)
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
  saveGarden(e) {
    console.log(e)
    this.setData({
      garden: (e.detail.value[0] + e.detail.value[1] + e.detail.value[2])
    })
  },
  //保存资料
  savaData: function(e) {
    let that = this;
    console.log(e)
    let formData = e.detail.value;
    let garden = that.data.garden;
    console.log(garden)
    if ( garden == '' || formData.contact_name == '' || formData.contact_phone == '' ||  formData.contact_area == ''){
      app.showToast({
        title: "请将资料填写完整!",
      })
      return;
    }
    let postmsg = {
      main_store: that.data.main_store,
      member_id: wx.getStorageSync('member_id'),
      name: formData.contact_name,
      phone: formData.contact_phone,
      address: garden + formData.contact_area,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    }
    that.sendRegister(postmsg);
  },
  //提交申请
  sendRegister(data) {
    console.log(data);
    common.post('/businessbranch/index?op=band_branch',data).then( res=> {
      if (res.data.code == 200) {
        //注册成功
        app.showToast({
          title: "授权成功!",
          duration:2000,
          success:function(){
            wx.reLaunch({
              url: '/packageA/pages/merchant_entrance/index',
            })
          }
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch( error=> {
      console.log(error);
      app.showToast({
        title: '数据异常：'+ error.data.message,
      })
    })
  },
})