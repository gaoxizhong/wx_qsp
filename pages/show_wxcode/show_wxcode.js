const app = getApp()
const common = require('../../assets/js/common');
const QR = require('../../assets/js/qrcode')
const publicMethod = require('../../assets/js/publicMethod');
Page({
  data: {
    img_url: app.data.imgUrl,
    imagePath: '',  //二维码路径
    desc: '',  //描述
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      member_id: wx.getStorageSync('member_id'),
      user_info: wx.getStorageSync('user_info'),
      configData: wx.getStorageSync('configData'),
      userInfo: app.globalData.userInfo,
    })
    if (options.scene) { //小程序码参数解码
      let scene = decodeURIComponent(options.scene);
      let scene_key = scene.split("&")[0];
      let member_id = scene_key.split("=")[1];
      that.setData({
        currentTab: 2
      })
      common.get("/environmental/bank/getMemberNickName",{member_id: member_id}).then( res => {
        if ( res.data.code == 200 ) {
          console.log("获取成功");
          that.setData({
            user_id: member_id,
            user_name: res.data.data.nickname.nickname
          })
        }
      })
    }
    if ( options.currentTab ) {
      that.setData({
        currentTab: options.currentTab
      })
    }
    console.log(options);
    that.getInComeInfo();
  },
  onShow: function(){
    let member_id = wx.getStorageSync('member_id')
    if(!member_id){
      wx.showModal({
        title:'未登录，是否前往登录？',
        success: function(res) {
          if(res.confirm){
            console.log('点击了确认');
            wx.reLaunch({
              url:'/pages/mine/index/index'
            })
          } else if(res.cancel) {
            console.log('点击了取消')
            wx.reLaunch({
              url:"/pages/bank/bank"
            })
          }
        }
      })
      return
    }
  },
  //收款码界面信息
  getInComeInfo() {
    let that = this;
    common.get("/environmental/bank/getQrcode",{member_id: that.data.member_id}).then( res => {
      console.log(res);
      if ( res.data.code == 200 ) {
        console.log("获取成功");
        console.log(res.data.data.desc);
        that.setData({
          inCome_title: res.data.data.title,
          imagePath: res.data.data.incomeImg,
          desc: res.data.data.desc.replace('\\n','\n'),
        })
      }
    }).catch( error => {
      console.log(error);
    })
  },
  //
  //跳转到查询订单页面
  turnToOrders() {
    console.log("跳转");
    wx.navigateTo({url: "/pages/historyorders/historyorders"})
  },
})