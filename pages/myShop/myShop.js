const app = getApp()
const common = require('../../assets/js/common');
const QR = require('../../assets/js/qrcode')
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    img_url: app.data.imgUrl,
    shopInfo: '',  //商铺信息
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })
    if (options) { //小程序码参数解码
      console.log(options);
      that.setData({
        business_id: options.business_id
      })
    }

  },
  onShow: function(){
    let member_id = wx.getStorageSync('member_id')
    this.getShopInfo();
  },
  //获取商家信息
  getShopInfo() {
    let that = this;
    common.get("/business/getMyshop", {
      business_id: that.data.business_id
    }).then( res => {
      if ( res.data.code == 200 ) {
        that.setData({
          shopInfo: res.data.data
        })
      }
    })
  },
  //去往创建活动页面
  goToCreate(e) {
    let url = "/pages/create_activity/create_activity?business_id=" + e.currentTarget.dataset.business_id
    wx.navigateTo({
      url: url
    })
  },
  //前往创建商家发圈
  goToShopPublish() {
    let url = "/pages/publish/publish?business_id=" + this.data.business_id;
    wx.navigateTo({
      url: url
    })
  },
  //前往核销订单
  goToDicountOrder(e) {
    let that = this;
    let url = "/pages/merchantOrder/index?type=2&status=" + e.currentTarget.dataset.status + '&business_id='+ that.data.business_id;
    wx.navigateTo({
      url: url
    })
  },
  onShareAppMessage(res) {
    let that = this
    console.log(res)
    let url = '/pages/shop/shop?business_id=' + that.data.business_id;
    if (res.from === 'button') {
      return {
        title: '青山生态 快来参加优惠活动吧！',
        path: url,
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log(res)
        },
        fail: function(res) {
          // 转发失败
        }
      }
    }
    return {
      title: '青山生态 正在发生…',
      imageUrl: '',
      path: url,
      success: function(res) {
        // 转发成功
        console.log(res)
      },
      fail: function(res) {
        // 转发失败
        console.log(res)
      }
    }
  }
})