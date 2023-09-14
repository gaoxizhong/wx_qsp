const app = getApp()
const common = require('../../assets/js/common');
const publicMethod = require('../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetUserProfile: false,
    longitude: '',
    latitude: '',
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取定位
    // publicMethod.zhuan_baidu(this);

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
    wx.login({
      success: (data) => {
        console.log(data)
        that.setData({
          code: data.code,
        })
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: res,
          icon:'none'
        })
      },

    })
    that.setData({
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      is_circle: 1,
      is_login: 1
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
  // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  getUserProfile() {
    // publicMethod.getUserProfile(this,this.getData);
    this.getUserProfileClick(this.getData);
  },

  // 微信授权
  getUserProfileClick(f){
    let that = this;
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', 
      success: (res) => {
        console.log(res)
        wx.setStorageSync('user_info', res.userInfo);
        that.setData({
          personData: res.userInfo
        })
        common.post('/member/oauth', {
          code: that.data.code,
          encryptedData: res.encryptedData,
          iv: res.iv,
          avatarUrl: '',
          nickName: '',
          gender: res.userInfo.gender,
        }).then(res => {
          if (res.data.code == 200) {
            that.setData({
              member_id: res.data.member_id,
            })
            wx.showToast({
              title: '登陆成功！',
              icon:'success'
            })
            wx.setStorageSync('member_id', res.data.member_id);
            if(res.data.api_token){
              wx.setStorageSync('token', res.data.api_token);
            }
            wx.setStorageSync('is_code', '0');
            if (typeof f == "function") {
              return f()
            }
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }).catch(e => {
          wx.showToast({
            title: e,
            icon: 'none'
          })
          console.log(e)
        })
        
      },
      fail: (res) => {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }

    })

  },

  //获取个人信息
  getPersonInfo() {
    let that = this;
    common.get('/content/getMemberInfo', {
      member_id: that.data.member_id
    }).then(res => {
      if (res.data.code == 200) {
        if(!res.data.data.nickname || res.data.data.nickname == ''){
          wx.navigateTo({
            url: '/pages/modifyInfo/index?is_newMember=1',
          })
        }else{
          that.gotoback();
        }
      }

    })
  },



  getData(){
    // publicMethod.zhuan_baidu(this);
    // app.guajifen(this,app.globalData.longitude,app.globalData.latitude);
    this.getPersonInfo();
    // this.gotoback();
  },

  // 后退
  gotoback(){
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 1500);

  },
  cancelLogin() {
    this.gotoback();
  },

  //  ==================== 隐私授权 ===================/
  agree(e){
    console.log("用户同意隐私授权, 接下来可以调用隐私协议中声明的隐私接口")
    wx.getClipboardData({
      success(res) {
        console.log("getClipboardData success", res)
      },
      fail(res) {
        console.log("getClipboardData fail", res)
      },
    })
  },
  disagree(e){
    console.log("用户拒绝隐私授权, 未同意过的隐私协议中的接口将不能调用")
  },
})