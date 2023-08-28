const app = getApp();
const common = require('../../../../assets/js/common');
const publicMethod = require('../../../../assets/js/publicMethod');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster_tabs:[],
    swiper_index:1,
    nodes: [{
      name: 'view',
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    id:'',
    details_info:{},
    pop1:false,
    textVal:'',
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      id: options.id,
    })
    
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
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
    let member_id = wx.getStorageSync('member_id');
    if (!member_id) {
      that.setData({
        pop2: true
      })
    } else {
      that.setData({
        pop2: false
      })
    }
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      configData: wx.getStorageSync("configData"),
      user_info: wx.getStorageSync('user_info'),
    })

    that.getdetails();
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
  onShareAppMessage: function (e) {
    console.log(e)
    let that = this;
    let id = that.data.id;
    let name = that.data.details_info.member_name;
    let url= '/packageA/pages/convenience_plate/plate_details/index?id=' + id;
    return {
      title: name,
      path: url,
      imageUrl: that.data.poster_tabs[0]
    }
  },
   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  // getUserProfile() {
  //   publicMethod.getUserProfile(this,() => {
  //     that.onShow();
  //   });
  // },
  moveServerProSwiper(e){
    this.setData({
      swiper_index:e.detail.current,
    })
  },
  // 获取详情信息
  getdetails() { 
    let that = this
    common.get('/newservice/detail', {
      member_id: wx.getStorageSync('member_id'),
      id: that.data.id
    }).then(res => {
      if (res.data.code == 200) {
        // let article = res.data.data.detail;
        let details_info = res.data.data.data;
        that.setData({
          details_info,
          c_list:res.data.data.c_list,
          poster_tabs: details_info.image,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常"
      })
    })
  },

 //打开评论弹框
  openComment(e) {
    let that = this
    let comment = that.data.details_info.comment;
    if(!comment){
      wx.showToast({
        title: '暂无评论权限！',
      })
      return
    } 
    that.setData({
      pop1: true
    })
  },

   //留言val
  bindTextChange(e) {
    let that = this
    that.setData({
      textVal: e.detail.value
    })
  },
  //评论
  sendComment() { 
    let that = this
    if (that.data.textVal == '' || that.data.textVal == null) return;
    common.get('/newservice/comment', {
      member_id: wx.getStorageSync('member_id'),
      service_id: that.data.id,
      content: that.data.textVal,
    }).then(res => {
      console.log("评论")
      console.log(res)
      if (res.data.code == 200) {
        app.showToast({
          title: res.data.msg,
          icon: 'success',
        })
        common.get('/newservice/detail', {
          member_id: wx.getStorageSync('member_id'),
          id: that.data.id
        }).then(res => {
          if (res.data.code == 200) {
            that.setData({
              c_list:res.data.data.c_list,
              pop1:false,
              textVal:''
            })
          }
        }).catch(e => {
          app.showToast({
            title: "数据异常"
          })
        })
      } else {
        app.showToast({
          title: res.data.msg,
        })
      }
    }).catch(e => {
      app.showToast({
        title: "数据异常",
      })
      console.log(e)
    })
  },
   // 初始化弹框
  popLock: function(event) {
    app.popLock(event.currentTarget.dataset.id);
    this.setData({
      pop1: app.globalData.pop1,
    });
  },
  /**调用电话 */
  tel: function () {
    if (this.data.details_info.mobile!=null){
      wx.makePhoneCall({
        phoneNumber: this.data.details_info.mobile,
      })
    }else{
      app.showToast({
        title: "暂无联系电话"
      })
    }
  },
  //查询路线
  getRoadLine(e) {
    let that = this;
    console.log(e);
    wx.getLocation({
      type: 'gcj02', //'gcj02'返回可以用于wx.openLocation的经纬度
      isHighAccuracy: true,
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        const latitude = Number(that.data.details_info.lat)
        const longitude = Number(that.data.details_info.lng)
        wx.openLocation({        //所以这里会显示你当前的位置
          latitude,
          longitude,
          name: that.data.details_info.member_name,
          address: that.data.details_info.garden + that.data.details_info.address,
          scale: 18
        })
      }
    })
  },
})