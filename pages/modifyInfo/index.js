const app = getApp()
const common = require('../../assets/js/common');
const setting = require('../../assets/js/setting');
const publicMethod = require('../../assets/js/publicMethod');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickname:'',
    is_newMember:'',
  },
  // 获取头像
  onChooseAvatar(e) {
    let that = this;
    const { avatarUrl } = e.detail 
    // this.setData({
    //   avatarUrl,
    // })
    wx.uploadFile({
      url: setting.apiUrl + '/file/uploadOss',
      filePath: avatarUrl,
      name: 'files[]',
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        let data = JSON.parse(res.data);
        console.log(data);
        if ( data.code == 0 ) {
          wx.hideLoading();
          that.setData({
            avatarUrl: data.data.url[0]
          })
        } else {
          app.showToast({
            title: "上传失败!",
          })
          wx.hideLoading()
        }
      },
      fail:function() {
        app.showToast({
          title: "上传失败!",
        })
        wx.hideLoading()
      },
      complete:function() {
        wx.hideLoading()
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      is_newMember: options.is_newMember
    })
    //获取个人信息
    that.getPersonInfo();
  },
  //获取个人信息
  getPersonInfo() {
    let that = this;
    common.get('/content/getMemberInfo', {
      member_id: wx.getStorageSync('member_id'),
    }).then(res => {
      if (res.data.code == 200) {
        that.setData({
          personalInfo: res.data.data,
          avatarUrl: res.data.data.avatar,
          nickname: res.data.data.nickname
        });

      }

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
    this.setData({
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
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
  getUserProfile(e) {
    let that = this;
    let nickname = e.detail.value.nickname;
    let avatar = that.data.avatarUrl;
    if(!avatar){
      wx.showToast({
        title: '请先上传头像！',
        icon:'none'
      })
      return
    }
    if(!nickname){
      wx.showToast({
        title: '请先填写昵称！',
        icon:'none'
      })
      return
    }
    that.setData({
      nickname
    })
    common.post("/member/nickname",{
      member_id: wx.getStorageSync('member_id'),
      avatar,
      nickname,
    }).then(res =>{
      if(res.data.code == 200){
        wx.showToast({
          title: '修改成功！',
        })
        let personalInfo = {};
        personalInfo.avatar = avatar;
        personalInfo.nickname = nickname;
        wx.setStorageSync('personalInfo', personalInfo);
        let num = 0;
        if(that.data.is_newMember == '1' || that.data.is_newMember){
          num = 2;
        }else{
          num = 1;
        }
        that.gotoback(num);
      }
    }).catch(e =>{
      console.log(e)
    })
  },


  gotoback(num){
    setTimeout(() => {
      wx.navigateBack({
        delta: num,
      })
    }, 1500);
  },
  cancelLogin() {
    this.gotoback();
  },
})