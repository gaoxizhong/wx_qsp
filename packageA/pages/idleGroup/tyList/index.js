const app = getApp();
const common = require('../../../../assets/js/common');
var zhuan_dingwei = require('../../../../assets/js/dingwei.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataStatus:false,
    member_List:[],  // 团组
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      group_id: options.group_id
    })
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
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      nearGroupList:[],  // 团组
    })
    that.getData();
  },
  getData() { //初始化数据
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success:function(res){
        console.log(res)
        that.setData({
         latitude : Number(res.latitude),
         longitude : Number(res.longitude)
        })
        // zhuan_dingwei方法转换百度标准
        var gcj02tobd09 = zhuan_dingwei.wgs84togcj02(that.data.longitude, that.data.latitude);
        that.setData({
          longitude: gcj02tobd09[0],
          latitude: gcj02tobd09[1]
        })
          that.getLibrarygeren();
      },
      fail: function(res) {
        // wx.showModal({
        //   title: '需要开启手机定位',
        //   content: '请前去开启GPS服务',
        //   showCancel:false,
        //   success (res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })
        that.setData({
          latitude: '',
          longitude: ''
        })
        that.getLibrarygeren();
        if (res.errMsg == "getLocation:fail auth deny") {
          that.openSetting(that)
        }
      }
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
     // 附近闲友
    getLibrarygeren() {
      let that = this;
      let params = {
        member_id:wx.getStorageSync('member_id'),
        lng: that.data.longitude,
        lat: that.data.latitude,
        group_id: that.data.group_id
      }
      wx.showLoading({
        title: '加载中...',
      })
      common.get("/idlegroup/detail", params).then( res => {
        console.log(res)
        if (res.data.code == 200) {
          wx.hideLoading();
          let member_List = res.data.data.members;
          that.setData({
            member_List,
          })
        }else{
          wx.hideLoading();
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
    // 点击闲友头像
    gotoxyIdle(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/mine/myIdle/index?member_id=' + id,
      });
    },
})