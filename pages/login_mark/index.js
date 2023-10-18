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
    checked: false,
    checkbox:[],
    innerShow: false,
    title: "用户隐私保护提示",
    desc1: "感谢您使用本小程序，您使用本小程序前应当阅井同意",
    urlTitle: "《用户隐私保护指引》",
    desc2: "当您点击同意并开始使用产品服务时，即表示你已理解并同息该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法进入小程序。",
    height: 0,
    getPrivacySetting: true
  },
  clickcheckbox(){
    this.setData({
      innerShow: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取定位
    // publicMethod.zhuan_baidu(this);
    if (wx.getPrivacySetting) {

    } else {
      // 低版本基础库不支持 wx.getPrivacySetting 接口
      this.setData({
        getPrivacySetting: false,
        checked: true
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
    let checkbox = this.data.checkbox;
    if (wx.getPrivacySetting) {
      if(checkbox.length == 0){
        wx.showToast({
          title: '请先同意《用户隐私保护协议》',
          icon: 'none'
        })
        return
      }
      this.getUserProfileClick(this.getData);
    } else {
      this.setData({
        checked: true
      })
      // 低版本基础库不支持 wx.getPrivacySetting 接口，隐私接口可以直接调用
      // publicMethod.getUserProfile(this,this.getData);
      this.getUserProfileClick(this.getData);
    }


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
    this.setData({
      innerShow: false,
      checked :true,
    })
  },
  disagree(e){
    console.log("用户拒绝隐私授权, 未同意过的隐私协议中的接口将不能调用")
    this.setData({
      innerShow: false,
      checked :false,
      checkbox : []
    })
  },
  openPrivacyContract() {
    wx.openPrivacyContract({
      success: res => {
        console.log('openPrivacyContract success')
      },
      fail: res => {
        console.error('openPrivacyContract fail', res)
      }
    })
  },
  bindChange(e){
    console.log(e)
    this.setData({
      checkbox : e.detail.value
    })
    if(e.detail.value.length == 0){
      this.setData({
        checked :false
      })
    }
    if(e.detail.value[0] == '1'){
      this.setData({
        checked :true,
        innerShow: true
      })
    }
  }
})